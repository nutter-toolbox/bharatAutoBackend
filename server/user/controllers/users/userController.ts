import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { UserService } from "./userService"
import { sendResponse } from "admin/helpers"
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants"
import { get, isEmpty } from "lodash";


export default class UserController {
    static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            // const { id } = req.params
            const id = get(req, "user_id", "");

            const data = await UserService.getUser(id)
            if (!data) {
                return res.status(404).json(sendResponse(
                    RESPONSE_TYPE.ERROR,
                    ERROR_MESSAGE.USER_NOT_EXISTS
                ))
            }
            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.USER_FETCHED,
                    data
                )
            );

        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }

    }

    static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {

            const id = get(req, "user_id", "");
            const { oldPassword, newPassword } = req.body

            // 1 check user
            const checkExistingUser = await UserService.getUser(id)
           
            if (!checkExistingUser) {
                return res.status(404).json(sendResponse(
                    RESPONSE_TYPE.ERROR,
                    ERROR_MESSAGE.USER_NOT_EXISTS
                ))
            }

            // 2 check old password
            const match = await bcrypt.compare(oldPassword, checkExistingUser.password);
        
            if (!match) {
                return res.status(400).json(sendResponse(
                    RESPONSE_TYPE.ERROR,
                    ERROR_MESSAGE.INVALID_OLD_PASSWORD
                ))
            }

            // 3 if TRUE change password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const response = await UserService.changePassword(id, hashedPassword)

            return res.status(204).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.USER_FETCHED,
                    response
                )
            );

        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
                err: err
            });
        }
    }



    static async editUser(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const id = get(req, "user_id", "");
            const image = value.profile_photo_data;
            delete value.profile_photo_data;

            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }
            await UserService.editUser(
                id,
                { ...value },
                imageBuffer
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_UPDATED
                    )
                );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
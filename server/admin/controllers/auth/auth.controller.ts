import { NextFunction, Request, Response } from "express";
import { get, isEmpty } from "lodash";
import * as bcrypt from "bcrypt";
import AuthService from "./auth.service";
import {
    sendResponse,
    createAccessToken,
    createRefreshToken,
    createUserResponse,
    createPassword,
} from "admin/helpers";
import { RESPONSE_TYPE, ERROR_MESSAGE, SUCCESS_MESSAGE } from "admin/constants";
import { generateOtp } from "admin/helpers";
import { sendForgotPasswordEmail } from "helpers";
import UserService from '../users/user.service';
import RoleService from "../roles/service";

export default class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const email = get(req?.body, "email", "");
            const password = get(req?.body, "password", "");
            const ip = req.socket.localAddress;



            // Fetch the user by email
            const user = await AuthService.getUserByEmail(email);


            if (isEmpty(user)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.ADMIN_NOT_EXISTS
                        )
                    );
            }

            // Check if the user has the 'Admin' role
            const adminRole = await RoleService.getByName("Super Admin");
            if (!adminRole || String(user.role.id) !== String(adminRole.id)) {
                return res
                    .status(403)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.UNAUTHORIZED_ACCESS
                        )
                    );
            }


            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.INVALID_LOGIN_REQUEST
                        )
                    );
            }

            // Send email verification code
            // await AuthService.sendEmailVerificationCode({
            //     user_id: user.id,
            //     code: generateOtp(),
            //     email: user.email,
            // });

            const accessToken = createAccessToken({
                id: user.id,
                email: user.email,
            });

            const refreshToken = createRefreshToken({
                email: user.email,
            });

            await AuthService.updateRefreshToken({
                user_id: user.id,
                refresh_token: refreshToken,
                last_login_at: new Date(),
                last_login_ip: ip,
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LOGGED_IN, {
                    user: createUserResponse(user),
                    accessToken,
                    refreshToken,
                })

            );
        } catch (err) {
            console.error("Login error:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async stafflogin(req: Request, res: Response, next: NextFunction) {
        try {
            const email = get(req?.body, "email", "");
            const password = get(req?.body, "password", "");

            // Fetch the user by email
            const user = await AuthService.getUserByEmail(email);
         
            if (isEmpty(user)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.ADMIN_NOT_EXISTS
                        )
                    );
            }

            // Check if the user has the 'Staff' role
            const staffRole = await RoleService.getByName("Staff");
            if (!staffRole || String(user.role) !== String(staffRole.id)) {
                return res
                    .status(403)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.UNAUTHORIZED_ACCESS
                        )
                    );
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.INVALID_LOGIN_REQUEST
                        )
                    );
            }

            // Generate user response and send success response
            const userResponse = createUserResponse(user);
            const accessToken = createAccessToken({
                id: user.id,
                email: user.email,
            });
       
            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LOGGED_IN, { user: userResponse, accessToken })
            );

        } catch (err) {
            console.error("Login error:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }


    static async verifyEmailOtp(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_id = get(req?.body, "user_id", "");
            const code = get(req?.body, "code", "");
            const ip = req.socket.localAddress;

            const user = await AuthService.getUserById(user_id);
           
            if (isEmpty(user)) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.USER_NOT_EXISTS,
                });
            }

            if (code !== user?.email_code) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_CODE,
                });
            }

            if (new Date() > user?.email_code_expiry) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.EXPIRED_CODE,
                });
            }

            await AuthService.resetOtp(user_id);

            const accessToken = createAccessToken({
                id: user.id,
                email: user.email,
            });

            const refreshToken = createRefreshToken({
                email: user.email,
            });

            await AuthService.updateRefreshToken({
                user_id: user.id,
                refresh_token: refreshToken,
                last_login_at: new Date(),
                last_login_ip: ip,
            });

            return res
                .status(201)
                .send(
                    sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LOGGED_IN, {
                        user: createUserResponse(user),
                        accessToken,
                        refreshToken,
                    })
                );
        } catch (err) {
           
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async resendEmailOtp(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_id = get(req?.params, "user_id", "");

            const user = await AuthService.getUserById(user_id);
            if (isEmpty(user)) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.USER_NOT_EXISTS,
                });
            }

            await AuthService.sendEmailVerificationCode({
                user_id: user.id,
                code: generateOtp(),
                email: user.email,
            });

            return res
                .status(201)
                .send(
                    sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LOGGED_IN, {
                        user: createUserResponse(user),
                    })
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async editProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user_id = get(req, "user_id", 0);
            const full_name = get(req?.body, "full_name", "");
            const contact_number = get(req?.body, "contact_number", "");
            const phone_code = get(req?.body, "phone_code", 0);
            const address = get(req?.body, "address", "");

            const user = await AuthService.editProfile({
                user_id,
                full_name,
                contact_number,
                phone_code,
                address,
            });

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.PROFILE_UPDATED,
                    {
                        user: createUserResponse(user),
                    }
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async changePassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_id = get(req, "user_id", 0);
            const old_password = get(req?.body, "old_password", "");
            const new_password = get(req?.body, "new_password", "");

            const user = await AuthService.getUserPassword(user_id);
            const validPassword = await bcrypt.compare(
                old_password,
                user.password
            );
            if (!validPassword) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.INVALID_OLD_PASSWORD
                        )
                    );
            }

            const hashedPassword = await createPassword(new_password);
            await AuthService.changePassword({
                user_id,
                password: hashedPassword,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.PASSWORD_UPDATED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async forgotPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const email = get(req?.body, "email", "");

            const user = await AuthService.getUserByEmail(email);

            if (isEmpty(user)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.EMAIL_NOT_FOUND
                        )
                    );
            }

            const refreshToken = createRefreshToken({
                email: user.email,
            });

            await sendForgotPasswordEmail(user?.email, refreshToken);
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 15);
            await AuthService.updateForgotPasswordDetails({
                password_reset_code: refreshToken,
                password_reset_expiry: expiryDate,
                id: user?.id,
            });

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.FORGOT_PASSWORD_SENT
                )
            );
        } catch (err) {
            return res.status(400).send({
                message: ERROR_MESSAGE.INVALID_REQUEST,
            });
        }
    }

    static async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const refreshToken = get(req?.body, "token", "");
            const password = get(req?.body, "password", "");

            const user = await AuthService.getUserByrefreshToken(refreshToken);

            if (isEmpty(user)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.EMAIL_NOT_FOUND
                        )
                    );
            }

            if (refreshToken !== user?.password_reset_code) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_CODE,
                });
            }

            if (new Date() > user?.password_reset_expiry) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.EXPIRED_CODE,
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await AuthService.resetPassword({
                password: hashedPassword,
                id: user?.id,
            });

            await AuthService.updateForgotPasswordDetails({
                password_reset_code: null,
                password_reset_expiry: null,
                id: user?.id,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.PASSWORD_RESET
                    )
                );
        } catch (err) {
            return res.status(400).send({
                message: ERROR_MESSAGE.INVALID_REQUEST,
            });
        }
    }

    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const full_name = get(req?.body, "fullname", "");
            const email = get(req?.body, "email", "");
            const password = get(req?.body, "password", 0);
            const is_agreed = get(req?.body, "is_agreed", false);

            const user = await AuthService.getUserByEmail(email);

            if (!isEmpty(user)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.USER_EXISTS
                        )
                    );
            }

            const hashedPassword = await createPassword(password);
            await UserService.signup(
                {
                    full_name,
                    password: hashedPassword,
                    email,
                    is_agreed
                }
            );

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.SIGNUP_SUCCESS,
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}

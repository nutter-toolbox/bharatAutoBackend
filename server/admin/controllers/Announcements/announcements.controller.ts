import { Request, Response, NextFunction } from "express";
import AnnouncementsService from "./announcements.service";
import { get, isEmpty } from "lodash";

import { sendResponse } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class AnnouncementsController {
    static async addAnnouncements(req: Request, res: Response, next: NextFunction) {
        try {
            const value = req.body;
            const image: string = value?.profile_photo_data;
            delete value?.profile_photo_data;
            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }

            // use imageBuffer
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            const newAnnouncements = await AnnouncementsService.addAnnouncements({
               ...value,
            },    imageBuffer);

            return res.status(201).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ANNOUNCEMENTS_ADDED, newAnnouncements)
            );
        } catch (err) {
            next(err);
        }
    }

  
    

    static async getAnnouncementss(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            const status = get(req?.query, "status", "");
            let sorting = get(req?.query, "sorting", "id DESC");
            sorting = sorting.split(" ");

            const users = await AnnouncementsService.getAllAnnouncementss({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting,
                trashOnly,
                status
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.ANNOUNCEMENTS_FETCHED,
                        users
                    )
                );
        } catch (err) {
 
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getAnnouncements(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const permission = await AnnouncementsService.getAnnouncementsById(id);

            if (!permission) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.ANNOUNCEMENTS_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ANNOUNCEMENTS_FETCHED, permission)
            );
        } catch (err) {
            next(err);
        }
    }

    static async editAnnouncements(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const { id } = req.params;
            const image = value.profile_photo_data;
            delete value.profile_photo_data;

            const existingAnnouncements = await AnnouncementsService.getAnnouncementsById(id);
            if (!existingAnnouncements) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.ANNOUNCEMENTS_NOT_FOUND)
                );
            }
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

            const updatedAnnouncements = await AnnouncementsService.updateAnnouncements(                id,
                { ...value },
                imageBuffer);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ANNOUNCEMENTS_UPDATED, updatedAnnouncements)
            );
        } catch (err) {
            console.log(err)
            next(err);
        }
    }



    static async deleteAnnouncements(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body;

            if (!ids || !ids.length) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.INVALID_IDS)
                );
            }

            await AnnouncementsService.deleteAnnouncementss(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ANNOUNCEMENTS_DELETED)
            );
        } catch (err) {
            next(err);
        }
    }
}



import { Request, Response, NextFunction } from "express";
import TicketsService from "./tickets.service";
import { get, isEmpty } from "lodash";

import { sendResponse, getDateRange } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class TicketsController {
    static async addTickets(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;


            const processImage = (image: string | undefined): Buffer | undefined => {
                if (!image) return undefined;
                const parts = image.split(";base64,");
                const base64Image = parts.pop();
                return Buffer.from(base64Image!, "base64");
            };


            const estimatePricePhotoBuffer = processImage(value.estimate_price_data);
            const billingPricePhotoBuffer = processImage(value.billing_price_photo_data);
            const actualPricePhotoBuffer = processImage(value.actual_price_photo_data);
            const actualPricePhototwoBuffer = processImage(value.actual_price_photo_two_data);
            const actualPricePhotothreeBuffer = processImage(value.actual_price_photo_three_data);
            const outstandingPricePhotoBuffer = processImage(value.outstanding_price_photo_data);
            const appriciationOnePhotoBuffer = processImage(value.appriciation_one_photo_data);
            const appriciationTwoPhotoBuffer = processImage(value.appriciation_two_data);
            const appriciationThreePhotoBuffer = processImage(value.appriciation_three_photo_data);
            const socialMediaFeedbackPhotoBuffer = processImage(value.social_media_feedback_photo_data);


            delete value.estimate_price_data;
            delete value.billing_price_photo_data;
            delete value.actual_price_photo_data;
            delete value.actual_price_photo_two_data;
            delete value.actual_price_photo_three_data;
            delete value.outstanding_price_photo_data;
            delete value.appriciation_one_photo_data;
            delete value.appriciation_two_photo_data;
            delete value.appriciation_three_photo_data;
            delete value.social_media_feedback_photo_data;

            // Use processed image buffers for each photo
            const newTickets = await TicketsService.addTickets({
                ...value,
            },
                {
                    estimatePricePhotoBuffer,
                    billingPricePhotoBuffer,
                    actualPricePhotoBuffer,
                    actualPricePhototwoBuffer,
                    actualPricePhotothreeBuffer,
                    outstandingPricePhotoBuffer,
                    appriciationOnePhotoBuffer,
                    appriciationTwoPhotoBuffer,
                    appriciationThreePhotoBuffer,
                    socialMediaFeedbackPhotoBuffer
                }
            );

            return res.status(201).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TICKETS_ADDED, newTickets)
            );
        } catch (err) {
    
            
            next(err);
        }
    }

    static async getTicketss(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            const status = get(req?.query, "status", "");
            const customer_id = get(req?.query, "customer_id", "");
            let sorting: any = "status ASC";
            sorting = sorting.split(" ");
            const rangeType = get(req?.query, "rangeType", "");
            const range = get(req?.query, "range", "");
            let dates = null;
            if (rangeType) {
                dates = getDateRange(rangeType, range);
            }

   

            const users = await TicketsService.getAllTicketss({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting,
                trashOnly,
                status,
                customer_id: customer_id,
                dates
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TICKETS_FETCHED,
                        users
                    )
                );
        } catch (err) {
          console.log(err)
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getTicketsByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const size = parseInt(get(req?.query, "size", 10));
            const skip = parseInt(get(req?.query, "skip", 0));
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            const status = get(req?.query, "status", "");
            const user_id = get(req, "user_id", null);

            if (!user_id) {
                return res.status(400).send({
                    message: "User ID is required.",
                });
            }

            let sorting = get(req?.query, "sorting", "id DESC");
            sorting = sorting.split(" ");

            const tickets = await TicketsService.getTicketsByUser({
                offset: skip,
                limit: size,
                search,
                sorting,
                trashOnly,
                status,
                user_id,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TICKETS_FETCHED,
                        tickets
                    )
                );
        } catch (err) {
          
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getTickets(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const permission = await TicketsService.getTicketsById(id);

            if (!permission) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.TICKETS_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TICKETS_FETCHED, permission)
            );
        } catch (err) {
            next(err);
        }
    }

    static async editTickets(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            let value = req.body;

            // Extract images from the request body
            const images = {
                estimatePricePhoto: value.estimate_price_data,
                billingPricePhoto: value.billing_price_photo_data,
                actualPricePhoto: value.actual_price_photo_data,
                actualPricePhotoTwo: value.actual_price_photo_two_data,
                actualPricePhotoThree: value.actual_price_photo_three_data,
                outstandingPricePhoto: value.outstanding_price_photo_data,
                appriciationOnePhoto: value.appriciation_one_photo_data,
                appriciationTwoPhoto: value.appriciation_two_data,
                appriciationThreePhoto: value.appriciation_three_photo_data,
                socialMediaFeedbackPhoto: value.social_media_feedback_photo_data,
            };

            // Remove image data from the value object
            delete value.estimate_price_data;
            delete value.billing_price_photo_data;
            delete value.actual_price_photo_data;
            delete value.actual_price_photo_two_data;
            delete value.actual_price_photo_three_data;
            delete value.outstanding_price_photo_data;
            delete value.appriciation_one_photo_data;
            delete value.appriciation_two_data;
            delete value.appriciation_three_photo_data;
            delete value.social_media_feedback_photo_data;

            // Convert image data to Buffers
            const imageBuffers: Record<string, Buffer | undefined> = {};
            for (const [key, base64Image] of Object.entries(images)) {
                if (base64Image) {
                    const parts = base64Image.split(";base64,");
                    const base64Data = parts.pop();
                    imageBuffers[key] = Buffer.from(base64Data!, "base64");
                }
            }

            const existingTickets = await TicketsService.getTicketsById(id);
            if (!existingTickets) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.TICKETS_NOT_FOUND)
                );
            }

            const updatedTickets = await TicketsService.editTickets(id, value, imageBuffers);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TICKETS_UPDATED, updatedTickets)
            );
        } catch (err) {
  
            next(err);
        }
    }

    static async deleteTickets(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body;

            if (!ids || !ids.length) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.INVALID_IDS)
                );
            }

            await TicketsService.deleteTicketss(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TICKETS_DELETED)
            );
        } catch (err) {
            next(err);
        }
    }
}



import { sendResponse } from "admin/helpers";
import { TicketsService } from "./ticketService";
import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";


export default class TicketController {
    static async getTickets(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req, "user_id", "");

            const users = await TicketsService.getTickets(id);

            return res
                .status(200)
                .json(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TICKETS_FETCHED,
                        users
                    )
                );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getTicket(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const result = await TicketsService.getTicketById(id)
            if (!result) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.TICKET_NOT_FOUND)
                );
            }
            return res.status(200).json(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.TICKET_FETCHED,
                    result
                )
            );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    static async recentFive(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req, "user_id", "");
            const result = await TicketsService.recentFive(id);
            if (!result) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.TICKET_NOT_FOUND)
                );
            }
            return res.status(200).json(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.TICKET_FETCHED,
                    result
                )
            );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
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

            const existingTickets = await TicketsService.getTicketById(id);
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


    static async updateTicketStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            console.log(status)

            if (!status) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.STATUS_NOT_PROVIDED)
                );
            }


            const existingTicket = await TicketsService.getTicketById(id);
            if (!existingTicket) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.TICKET_NOT_FOUND)
                );
            }
            // const updateFields: { status: string; startdate?: Date; enddate?: Date } = { status };

            const updateFields: { status: string; startdate?: string; enddate?: string } = { status };

            // if (status === 'In Progress') {

            //     updateFields.startdate = new Date();
            // } else if (status === 'completed') {

            //     updateFields.enddate = new Date();
            // }
            if (status === 'In Progress') {
                updateFields.startdate = new Date().toISOString();
            } else if (status === 'completed') {
                updateFields.enddate = new Date().toISOString();
            }
            // Update the ticket's status
            const updatedTicket = await TicketsService.updateTicketStatus(id, updateFields);

            // Send the updated ticket in the response
            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TICKET_STATUS_UPDATED, updatedTicket)
            );
        } catch (err) {
            next(err);
        }
    }
}
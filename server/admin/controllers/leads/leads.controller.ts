import { Request, Response, NextFunction } from "express";
import LeadsService from "./leads.service";
import { get, isEmpty } from "lodash";

import { sendResponse, getDateRange } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class LeadsController {
    static async addLeads(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName,
                lastName,
                email,
                phone_code,
                phoneNumber,
                company,
                status,
                source, } = req.body;
            const newLeads = await LeadsService.addLeads({
                firstName,
                lastName,
                email,
                phone_code,
                phoneNumber,
                company,
                status,
                source,
            });

            return res.status(201).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LEAD_ADDED, newLeads)
            );
        } catch (err) {
            next(err);
        }
    }

    static async getLeadss(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            const status = get(req?.query, "status", "");
            let sorting = get(req?.query, "sorting", "id DESC");
            sorting = sorting.split(" ");
            const rangeType = get(req?.query, "rangeType", "");
            const range = get(req?.query, "range", "");
            let dates = null;
            
            if (rangeType) {
                dates = getDateRange(rangeType, range);
            }

            const users = await LeadsService.getAllLeadss({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting,
                trashOnly,
                status,
                dates
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.LEADS_FETCHED,
                        users
                    )
                );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getLeads(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const permission = await LeadsService.getLeadsById(id);

            if (!permission) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.LEADS_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LEADS_FETCHED, permission)
            );
        } catch (err) {
            next(err);
        }
    }

    static async editLeads(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { firstName,
                lastName,
                email,
                phone_code,
                phoneNumber,
                company,
                status,
                source, } = req.body;

            const existingLeads = await LeadsService.getLeadsById(id);
            if (!existingLeads) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.LEADS_NOT_FOUND)
                );
            }

            const updatedLeads = await LeadsService.updateLeads(id, {
                firstName,
                lastName,
                email,
                phone_code,
                phoneNumber,
                company,
                status,
                source,
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LEADS_UPDATED, updatedLeads)
            );
        } catch (err) {
            console.log("EditLeadErr", err);

            next(err);
        }
    }

    static async convertLead(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status, comment } = req.body;

            const existingLeads = await LeadsService.getLeadsById(id);
            if (!existingLeads) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.LEAD_NOT_EXIST)
                );
            }

            const convertLead = await LeadsService.convertLead(id, {
                comment,
                status,
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LEAD_CONVERTED, convertLead)
            );
        } catch (err) {
            next(err);
        }
    }

    static async deleteLeads(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body;

            if (!ids || !ids.length) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.INVALID_IDS)
                );
            }

            await LeadsService.deleteLeadss(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LEADS_DELETED)
            );
        } catch (err) {
            next(err);
        }
    }
}



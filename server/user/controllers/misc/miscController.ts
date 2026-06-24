import { NextFunction, Request, Response } from "express";
import {
    RESPONSE_TYPE,
    SUCCESS_MESSAGE,
    ERROR_MESSAGE,
    METRIC_TYPES
} from "admin/constants";

// import AuthService from "../auth/auth.service";
import { get } from "lodash";

import MiscService from "./miscService";
import { sendResponse } from "admin/helpers";

export default class MiscController {
   
static async getStatus( req: Request,
    res: Response,
    next: NextFunction){
    try{
            const id = get(req, "user_id", "");
        const response = await MiscService.getTicketsStatus(id)
        
        return res.status(200).send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TICKETS_STATUS_FETCHED,
                        response
                    )
                );
    }
    catch (err) {
        return res.status(400).send({
            message: ERROR_MESSAGE.INVALID_REQUEST,
        });
    }
}
}

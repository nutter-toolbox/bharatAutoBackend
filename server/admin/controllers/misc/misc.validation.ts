import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";
import { DATEFILTERS, METRIC_TYPES } from "admin/constants";

const getMetricsQuery = Joi.object().keys({
    range: Joi.string()
        .valid(...Object.values(DATEFILTERS))
        .optional().allow(''),
    rangeType: Joi.string()
        .optional().allow(''),
    type: Joi.string()
        .valid(...Object.values(METRIC_TYPES))
        .required(),
});

export const validateGetMetricsQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, getMetricsQuery, "query");

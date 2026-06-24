import Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";

const leadsSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    status: Joi.string().valid('New', 'In Progress', 'Contacted', 'Converted', 'Rejected').required(),
    source: Joi.string().valid('Website', 'Referral', 'Social Media', 'Other').required(),
    email: Joi.string().allow('').optional(),
    phone_code: Joi.string().required(),
    company: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^\+?[0-9]+$/).required(),




});

export function validateLeadsBody(req: Request, res: Response, next: NextFunction) {
    const { error } = leadsSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).send({
            message: "Validation errors",
            errors: errorMessages,
        });
    }
    next();
}




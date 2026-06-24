import Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";

const ticketsSchema = Joi.object({
    estimate_price_text: Joi.string().optional().allow(''),
    estimate_price_data: Joi.string().optional().allow(''),
    billing_price_text: Joi.string().optional().allow(''),
    billing_price_photo_data: Joi.string().optional().allow(''),
    actual_price_text: Joi.string().optional().allow(''),
    actual_price_photo_data: Joi.string().optional().allow(''),
    outstanding_price_text: Joi.string().optional().allow(''),
    outstanding_price_photo_data: Joi.string().optional().allow(''),
    appriciation_one_photo_data: Joi.string().optional().allow(''),
    social_media_feedback_photo_data: Joi.string().optional().allow(''),
    actual_price_photo_two_data: Joi.string().optional().allow(''),
    actual_price_photo_three_data: Joi.string().optional().allow(''),
    actual_price_text_two: Joi.string().optional().allow(''),
    actual_price_text_three: Joi.string().optional().allow(''),
});


export function validateTicketsBody(req: Request, res: Response, next: NextFunction) {
    const { error } = ticketsSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).send({
            message: "Validation errors",
            errors: errorMessages,
        });
    }
    next();
}



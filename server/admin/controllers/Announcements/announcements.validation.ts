import Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";

const announcementsSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    status: Joi.string().valid('Draft', 'Published').required(),
    profile_photo: Joi.string().optional().allow(''),
    profile_photo_data: Joi.string().optional().allow(''),
    
});

export function validateAnnouncementsBody(req: Request, res: Response, next: NextFunction) {
    const { error } = announcementsSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).send({
            message: "Validation errors",
            errors: errorMessages,
        });
    }
    next();
}



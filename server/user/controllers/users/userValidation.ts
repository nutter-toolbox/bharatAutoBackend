import Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";
import { validateReq } from "../../../helpers/api-validations";



export const addUserSchema = Joi.object().keys({
    password: Joi.string().optional(),
    email: Joi.string().email().required(),
    role: Joi.string().optional().allow(''),

    full_name: Joi.string().required(),
    contact_number: Joi.string().pattern(/^[0-9]+$/).required(),
    phone_code: Joi.string().required(),
    country_code: Joi.string().length(2).uppercase().required(),
    address: Joi.string().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
    profile_photo: Joi.string().optional().allow(''),
    profile_photo_data: Joi.string().optional().allow(''),
});

export const validateUserBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, addUserSchema, "body");


export const changePasswordSchema = Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
})

export const validatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, changePasswordSchema, "body");

const listUserQuery = Joi.object().keys({
    size: Joi.number().required(),
    skip: Joi.number().required(),
    search: Joi.string().optional().allow(""),
    sorting: Joi.string().optional().allow(""),
    trashOnly: Joi.string().optional().allow("").valid("true", ""),
});

export const validateListUserQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, listUserQuery, "query");

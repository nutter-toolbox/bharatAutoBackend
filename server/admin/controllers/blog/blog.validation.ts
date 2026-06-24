import Joi from "@hapi/joi"
import { Request, Response, NextFunction } from "express"

const blogSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
})

export function validateBlogBody(req: Request, res: Response, next: NextFunction) {
    const { error } = blogSchema.validate(req.body, { abortEarly: false })
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message)

       return res.status(400).json({
            message: "Validation errors",
            errors: errorMessages,
        })
    }
    next()
}
import Joi from "@hapi/joi"
import { Request, Response, NextFunction } from "express"
const todoSchema = Joi.object({
    title: Joi.string().required(),
    status: Joi.boolean(),
    userId: Joi.string().optional(),
})

export function validateTodoBody(req: Request, res: Response, next: NextFunction) {
    const { error } = todoSchema.validate(req.body, { abortEarly: true })

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message)
        res.status(400).json({
            message: "Validation error",
            errors: errorMessages
        })
    }
    next()
}
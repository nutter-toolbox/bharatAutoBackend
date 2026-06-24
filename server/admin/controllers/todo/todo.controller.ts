import { Request, Response, NextFunction } from "express"
import { get } from "lodash"
import TodoService from "./todo.service"
import { sendResponse } from "admin/helpers"
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants"

export default class TodoController {
    static async addTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, status, userId } = req.body
            const newTodo = await TodoService.addTodo({ title, status, userId })
            return res.status(201).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TODO_ADDED, newTodo)
            )
        } catch (error) {
            next(error)
        }
    }
    static async getTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            const status = get(req?.query, "status", "");
            let sorting = get(req?.query, "sorting", "id DESC");
            sorting = sorting.split(" ");

            const data = await TodoService.getTodos({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting,
                trashOnly,
                status
            });

            return res.status(200).json(sendResponse(
                RESPONSE_TYPE.SUCCESS,
                SUCCESS_MESSAGE.TODOS_FETCHED,
                data
            ));
        } catch (err) {
            next(err)
        }
    }
    static async getTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const data = await TodoService.getTodo(id)
            return res.status(200).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TODO_FETCHED, data)
            )
        } catch (error) {
            next(error)
        }
    }
    static async updateTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const { title, status } = req.body
            const checkTodo = await TodoService.getTodo(id)
            if (!checkTodo) {
                return res.status(404).json(sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.TODO_NOT_EXIST))
            }
            const response = await TodoService.updateTodo(id, { title, status })
            return res.status(200).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TODO_UPDATED, response)
            )
        } catch (error) {
            next(error)
        }
    }
    static async deleteTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body
            await TodoService.deleteTodo(ids)
            return res.status(200).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.TODO_DELETED)
            )
        } catch (error) {
            next(error)
        }
    }
}
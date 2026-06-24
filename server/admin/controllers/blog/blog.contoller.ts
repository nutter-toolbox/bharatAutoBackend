import { Request, Response, NextFunction } from "express";
import BlogService from "./blog.service";
import { sendResponse } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class BlogController {
    static async addBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, description, status } = req.body;
            const newBlog = await BlogService.addBlog({ title, description, status })

            return res.status(201).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.BLOG_ADDED, newBlog)
            )
        } catch (err) {
            next(err)
        }
    }
    static async getBlogs(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = req.query
            const data = await BlogService.getBlogs(filters)

            return res.status(200).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.BLOGS_FETCHED, data)
            )
        } catch (err) {
            next(err)
        }
    }
    static async getBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const data = await BlogService.getBlog(id)

            return res.status(200).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.BLOG_FETCHED, data)
            )
        } catch (err) {
            next(err)
        }
    }
    static async updateBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const values = req.body

            const checkBlog = await BlogService.getBlog(id)
            if (!checkBlog) {
                return res.status(404).json(sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.BLOG_NOT_EXIST))

            }
            const data = await BlogService.updateBlog(id, values)
            return res.status(200).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.BLOG_UPDATED, data)
            )
        } catch (err) {
            next(err)
        }
    }
    static async deleteBlogs(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body

            if (!ids || !ids.length) {
                return res.status(400).json(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.BLOG_PROVIDE_ID)
                )
            }
            await BlogService.deleteBlogs(ids)

            return res.status(200).json(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.BLOG_DELETED)
            )
        } catch (err) {
            next(err)
        }
    }
}
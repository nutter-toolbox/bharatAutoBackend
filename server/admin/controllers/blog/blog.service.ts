import { Blog } from "../../models/Blog"
import { TBlog } from "../../../common/types/blog"


export default class BlogService {
    static async addBlog(data: TBlog) {
        const obj = new Blog()
        const response = await obj.addBlog(data)
        return response
    }
    static async getBlogs(filters: any) {
        const obj = new Blog()
        const response = await obj.getBlogs(filters)
        return response
    }
    static async getBlog(id: string) {
        const obj = new Blog()
        const response = await obj.getBlog(id)
        return response
    }
    static async updateBlog(id: string, data:TBlog) {
        const obj = new Blog()
        const response = await obj.updateBlog(id,data)
        return response
    }
    static async deleteBlogs(ids: string[]) {
        const obj = new Blog()
        const response = await obj.deleteBlogs(ids)
        return response
    }
}
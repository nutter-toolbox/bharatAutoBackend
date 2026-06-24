import { Blog as BlogModel } from "database/schema";
import { TBlog } from "../../../common/types/blog";

export class Blog {
    public async addBlog(data: TBlog): Promise<TBlog | any> {
        const newBlog = await BlogModel.create(data);
        return newBlog;
    }

    public async getBlogs(filters: any): Promise<{ count: number, data: any[] }> {
        const { skip, limit } = filters;

        const { count, rows } = await BlogModel.findAndCountAll({
            offset: skip,
            limit: limit,
        });

        return { count, data: rows };
    }

    public async getBlog(id: string): Promise<TBlog | any> {
        const blog = await BlogModel.findByPk(id);
        return blog ?? null;
    }

    public async updateBlog(id: string, data: TBlog): Promise<TBlog | any> {
        const [updatedRowsCount, updatedBlogs] = await BlogModel.update(data, {
            where: { id },
            returning: true,
        });

        return updatedRowsCount > 0 ? updatedBlogs[0] : null;
    }

    public async deleteBlogs(ids: string[]): Promise<number> {
        const result = await BlogModel.destroy({
            where: {
                id: ids,
            },
        });
        return result;
    }
}

import { Todo as TodoModel } from "database/schema";
import { TTodo } from "common/types/todo";
import { Op } from 'sequelize';

export default class Todo {
    public async addTodo(data: TTodo): Promise<TTodo | any> {
        const newTodo = await TodoModel.create(data);
        return newTodo;
    }

    public async getTodos(filters: any): Promise<TTodo | any> {
        const where = {};
        const { count, rows: data } = await TodoModel.findAndCountAll({
            where,
            offset: filters.skip,
            limit: filters.limit,
        });
        return { count, data };
    }

    public async getTodo(id: string): Promise<TTodo | any> {
        const todo = await TodoModel.findByPk(id);
        return todo ?? null;
    }

    public async updateTodo(id: string, data: TTodo): Promise<TTodo | any> {
        const todo = await TodoModel.findByPk(id);
        if (!todo) return null;

        const updatedTodo = await todo.update(data);
        return updatedTodo;
    }

    public async deleteTodo(ids: string[]): Promise<number> {
        const result = await TodoModel.destroy({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });
        return result;
    }
}

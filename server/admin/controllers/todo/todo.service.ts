import Todo from "admin/models/Todo";
import { TTodo } from "common/types/todo";


export default class TodoService {
    static async addTodo(data: TTodo) {
        const obj = new Todo
        const response = await obj.addTodo(data)
        return response
    }
    static async getTodos(filters: any) {
        const obj = new Todo
        const response = await obj.getTodos(filters)
        return response
    }
    static async getTodo(id: string) {
        const obj = new Todo
        const response = await obj.getTodo(id)
        return response
    }
    static async updateTodo(id: string, data: TTodo) {
        const obj = new Todo
        const response = await obj.updateTodo(id,data)
        return response
    }
    static async deleteTodo(ids: string[]) {
        const obj = new Todo
        const response = await obj.deleteTodo(ids)
        return response
    }
}
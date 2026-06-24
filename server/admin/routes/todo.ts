import TodoController from "admin/controllers/todo/todo.controller";
import { validateTodoBody } from "admin/controllers/todo/todo.validation";
import * as express from "express";

const router = express.Router();

const {
addTodo,getTodos,getTodo,updateTodo,deleteTodo
} = TodoController;

router.post("/", validateTodoBody, addTodo);
router.get("/", getTodos);
router.get("/:id", getTodo);
router.patch("/:id", validateTodoBody, updateTodo);
router.delete("/", deleteTodo);

export default router;

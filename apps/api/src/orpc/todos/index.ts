import { protectedRouter } from "../base.js";
import { todoCreate } from "./create.js";
import { todoList } from "./list.js";
import { todoRemove } from "./remove.js";
import { todoUpdate } from "./update.js";

const protectedTodos = protectedRouter.todos;

export const todosRouter = protectedTodos.router({
	list: protectedTodos.list.handler(todoList),
	create: protectedTodos.create.handler(todoCreate),
	update: protectedTodos.update.handler(todoUpdate),
	remove: protectedTodos.remove.handler(todoRemove),
});

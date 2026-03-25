import { i } from "./base.js";
import { todosRouter } from "./todos/index.js";

export const appRouter = i.router({
	todos: todosRouter,
});

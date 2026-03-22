import { todoContract } from "@monorepo-test/shared";
import { implement } from "@orpc/server";
import { todosRouter } from "./todos/index.js";

const i = implement(todoContract);

export const appRouter = i.router({
  todos: todosRouter,
});

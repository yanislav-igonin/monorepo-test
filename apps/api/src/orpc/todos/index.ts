import { todoContract } from "@monorepo-test/shared";
import { implement } from "@orpc/server";
import { todoCreate } from "./create.js";
import { todoList } from "./list.js";
import { todoRemove } from "./remove.js";
import { todoUpdate } from "./update.js";

const i = implement(todoContract);

export const todosRouter = i.todos.router({
  list: i.todos.list.handler(async () => todoList()),
  create: i.todos.create.handler(async ({ input }) => todoCreate(input)),
  update: i.todos.update.handler(async ({ input }) => todoUpdate(input)),
  remove: i.todos.remove.handler(async ({ input }) => todoRemove(input)),
});

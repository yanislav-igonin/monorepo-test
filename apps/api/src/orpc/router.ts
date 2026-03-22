import type { Todo } from "@monorepo-test/shared";
import { todoContract } from "@monorepo-test/shared";
import { implement, ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { todos } from "../db/schema.js";
import type { TodoRow } from "../db/schema.js";

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.createdAt,
  };
}

const i = implement(todoContract);

export const appRouter = i.router({
  todos: i.todos.router({
    list: i.todos.list.handler(async () => {
      const rows = db.select().from(todos).all();
      return rows.map(rowToTodo);
    }),
    create: i.todos.create.handler(async ({ input }) => {
      const { title } = input;
      const createdAt = new Date().toISOString();
      const [row] = db
        .insert(todos)
        .values({ title, completed: false, createdAt })
        .returning()
        .all();
      if (!row) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create todo",
        });
      }
      return rowToTodo(row);
    }),
    update: i.todos.update.handler(async ({ input }) => {
      const { id, title, completed } = input;
      const [existing] = db.select().from(todos).where(eq(todos.id, id)).all();
      if (!existing) {
        throw new ORPCError("NOT_FOUND", { message: "Not found" });
      }
      const [row] = db
        .update(todos)
        .set({
          title: title ?? existing.title,
          completed: completed ?? existing.completed,
        })
        .where(eq(todos.id, id))
        .returning()
        .all();
      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "Not found" });
      }
      return rowToTodo(row);
    }),
    remove: i.todos.remove.handler(async ({ input }) => {
      const { id } = input;
      const [removed] = db.delete(todos).where(eq(todos.id, id)).returning().all();
      if (!removed) {
        throw new ORPCError("NOT_FOUND", { message: "Not found" });
      }
    }),
  }),
});

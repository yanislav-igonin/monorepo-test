import type { UpdateTodoInput } from "@monorepo-test/shared";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";
import { rowToTodo } from "./helpers.js";

export async function todoUpdate(input: UpdateTodoInput) {
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
}

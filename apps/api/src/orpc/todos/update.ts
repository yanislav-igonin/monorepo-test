import type { UpdateTodoInput } from "@monorepo-test/shared";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";
import type { AuthenticatedContext } from "../base.js";
import { rowToTodo } from "./helpers.js";

interface TodoUpdateOptions {
  input: UpdateTodoInput;
  context: AuthenticatedContext;
}

export async function todoUpdate({ input, context }: TodoUpdateOptions) {
  const { id, title, completed } = input;
  const ownerFilter = and(
    eq(todos.id, id),
    eq(todos.userId, context.session.user.id),
  );
  const [existing] = db.select().from(todos).where(ownerFilter).all();
  if (!existing) {
    throw new ORPCError("NOT_FOUND", { message: "Not found" });
  }
  const [row] = db
    .update(todos)
    .set({
      title: title ?? existing.title,
      completed: completed ?? existing.completed,
    })
    .where(ownerFilter)
    .returning()
    .all();
  if (!row) {
    throw new ORPCError("NOT_FOUND", { message: "Not found" });
  }
  return rowToTodo(row);
}

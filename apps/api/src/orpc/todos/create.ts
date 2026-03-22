import type { CreateTodoBody } from "@monorepo-test/shared";
import { ORPCError } from "@orpc/server";
import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";
import { rowToTodo } from "./helpers.js";

export async function todoCreate(input: CreateTodoBody) {
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
}

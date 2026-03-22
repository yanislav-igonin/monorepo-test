import type { Todo } from "@monorepo-test/shared";
import type { TodoRow } from "../../db/schema.js";

export function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.createdAt,
  };
}

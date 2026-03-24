import type { UpdateTodoInput } from "@monorepo-test/shared";
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

export function buildTodoUpdatePatch(
  existing: Pick<TodoRow, "title" | "completed">,
  input: Pick<UpdateTodoInput, "title" | "completed">,
): Pick<TodoRow, "title" | "completed"> {
  return {
    title: input.title ?? existing.title,
    completed: input.completed ?? existing.completed,
  };
}

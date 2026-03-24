import { describe, expect, it } from "vitest";
import type { TodoRow } from "../../db/schema.js";
import { buildTodoUpdatePatch, rowToTodo } from "./helpers.js";

describe("rowToTodo", () => {
  it("maps a todo row to the shared todo shape", () => {
    const row: TodoRow = {
      id: 7,
      userId: "user-1",
      title: "Write tests",
      completed: false,
      createdAt: "2026-03-24T12:00:00.000Z",
    };

    expect(rowToTodo(row)).toEqual({
      id: 7,
      title: "Write tests",
      completed: false,
      createdAt: "2026-03-24T12:00:00.000Z",
    });
  });
});

describe("buildTodoUpdatePatch", () => {
  const existing = {
    title: "Existing title",
    completed: false,
  } satisfies Pick<TodoRow, "title" | "completed">;

  it("updates only the title when completed is omitted", () => {
    expect(
      buildTodoUpdatePatch(existing, {
        title: "Updated title",
        completed: undefined,
      }),
    ).toEqual({
      title: "Updated title",
      completed: false,
    });
  });

  it("preserves the title when only completed is provided", () => {
    expect(
      buildTodoUpdatePatch(existing, {
        title: undefined,
        completed: true,
      }),
    ).toEqual({
      title: "Existing title",
      completed: true,
    });
  });
});

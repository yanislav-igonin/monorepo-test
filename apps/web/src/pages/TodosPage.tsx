import type { Todo } from "@monorepo-test/shared";
import { type FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTodoMutationOptions,
  removeTodoMutationOptions,
  updateTodoMutationOptions,
  todosListQueryOptions,
} from "../api/todos";

export function TodosPage() {
  const [title, setTitle] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const todosQuery = useQuery(todosListQueryOptions());
  const createTodoMutation = useMutation(createTodoMutationOptions(queryClient));
  const updateTodoMutation = useMutation(updateTodoMutationOptions(queryClient));
  const removeTodoMutation = useMutation(removeTodoMutationOptions(queryClient));
  const todos = todosQuery.data ?? [];
  const loadError = todosQuery.isError ? "Failed to load todos" : null;

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    setActionError(null);
    if (!trimmed) return;
    try {
      await createTodoMutation.mutateAsync({ title: trimmed });
      setTitle("");
    } catch {
      setActionError("Failed to create todo");
    }
  }

  async function toggleCompleted(todo: Todo) {
    setActionError(null);
    try {
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        completed: !todo.completed,
      });
    } catch {
      setActionError("Failed to update todo");
    }
  }

  async function removeTodo(id: number) {
    setActionError(null);
    try {
      await removeTodoMutation.mutateAsync({ id });
    } catch {
      setActionError("Failed to delete todo");
    }
  }

  if (todosQuery.isPending) {
    return <p>Loading…</p>;
  }

  return (
    <div>
      <h1>Todos</h1>
      <form className="add-todo" onSubmit={handleAdd}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo"
          aria-label="Todo title"
        />
        <button type="submit">Add</button>
      </form>
      {actionError || loadError ? (
        <p className="error">{actionError ?? loadError}</p>
      ) : null}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => void toggleCompleted(todo)}
              aria-label={`Toggle ${todo.title}`}
            />
            <span className={todo.completed ? "done" : undefined}>
              {todo.title}
            </span>
            <button type="button" onClick={() => void removeTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

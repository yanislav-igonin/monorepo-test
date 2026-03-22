import { type Todo } from "@monorepo-test/shared";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { orpc } from "../api/orpc";

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    setError(null);
    try {
      const data = await orpc.todos.list({});
      setTodos(data);
    } catch {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setError(null);
    try {
      const created = await orpc.todos.create({ title: trimmed });
      setTodos((prev) => [...prev, created]);
      setTitle("");
    } catch {
      setError("Failed to create todo");
    }
  }

  async function toggleCompleted(todo: Todo) {
    setError(null);
    try {
      const updated = await orpc.todos.update({
        id: todo.id,
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch {
      setError("Failed to update todo");
    }
  }

  async function removeTodo(id: number) {
    setError(null);
    try {
      await orpc.todos.remove({ id });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete todo");
    }
  }

  if (loading) {
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
      {error ? <p className="error">{error}</p> : null}
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

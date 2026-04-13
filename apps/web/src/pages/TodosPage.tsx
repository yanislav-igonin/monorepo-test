import type { Todo } from "@monorepo-test/shared";
import { type FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, LoaderCircle, Plus, Trash2 } from "lucide-react";
import {
	createTodoMutationOptions,
	removeTodoMutationOptions,
	updateTodoMutationOptions,
	todosListQueryOptions,
} from "../api/todos";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";

export function TodosPage() {
	const [title, setTitle] = useState("");
	const [actionError, setActionError] = useState<string | null>(null);
	const queryClient = useQueryClient();
	const todosQuery = useQuery(todosListQueryOptions());
	const createTodoMutation = useMutation(
		createTodoMutationOptions(queryClient),
	);
	const updateTodoMutation = useMutation(
		updateTodoMutationOptions(queryClient),
	);
	const removeTodoMutation = useMutation(
		removeTodoMutationOptions(queryClient),
	);
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
		return (
			<div className="py-20 text-sm text-muted-foreground">Loading…</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight">Todos</h1>
				<p className="text-sm text-muted-foreground">
					{todos.length} {todos.length === 1 ? "item" : "items"}
				</p>
			</div>

			<form onSubmit={handleAdd}>
				<FieldGroup className="gap-4">
					<Field>
						<FieldLabel htmlFor="todo-title">Add todo</FieldLabel>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Input
								aria-label="Todo title"
								className="flex-1"
								id="todo-title"
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Ship the authenticated shell"
								value={title}
							/>
							<Button disabled={createTodoMutation.isPending} type="submit">
								{createTodoMutation.isPending ? (
									<LoaderCircle
										aria-hidden="true"
										className="animate-spin"
										data-icon="inline-start"
									/>
								) : (
									<Plus aria-hidden="true" data-icon="inline-start" />
								)}
								Add
							</Button>
						</div>
					</Field>
				</FieldGroup>
			</form>

			{actionError || loadError ? (
				<Alert variant="destructive">
					<AlertCircle aria-hidden="true" />
					<AlertTitle>Request failed</AlertTitle>
					<AlertDescription>{actionError ?? loadError}</AlertDescription>
				</Alert>
			) : null}

			<div className="space-y-2">
				{todos.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No todos yet. Add the first task above.
					</p>
				) : (
					todos.map((todo) => (
						<div
							key={todo.id}
							className="flex items-start justify-between gap-4 border-b py-3 last:border-b-0"
						>
							<div className="flex min-w-0 items-start gap-3">
								<Checkbox
									aria-label={`Toggle ${todo.title}`}
									checked={todo.completed}
									id={`todo-${todo.id}`}
									onCheckedChange={() => void toggleCompleted(todo)}
								/>
								<div className="min-w-0">
									<label
										className={cn(
											"block cursor-pointer text-sm font-medium",
											todo.completed && "text-muted-foreground line-through",
										)}
										htmlFor={`todo-${todo.id}`}
									>
										{todo.title}
									</label>
								</div>
							</div>
							<Button
								aria-label={`Delete ${todo.title}`}
								type="button"
								variant="ghost"
								onClick={() => void removeTodo(todo.id)}
							>
								<Trash2 aria-hidden="true" data-icon="inline-start" />
								Delete
							</Button>
						</div>
					))
				)}
			</div>
		</div>
	);
}

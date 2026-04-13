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
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
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
			<div className="flex items-center justify-center py-24">
				<div className="flex items-center gap-3 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
					<LoaderCircle aria-hidden="true" className="animate-spin" />
					Loading…
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<section className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
				<div className="space-y-3">
					<p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
						Tasks
					</p>
					<div className="space-y-2">
						<h1 className="text-3xl font-semibold tracking-tight text-foreground">
							Todos
						</h1>
						<p className="max-w-2xl text-sm text-muted-foreground">
							Track lightweight work items in the same authenticated shell as the
							rest of the workspace.
						</p>
					</div>
				</div>
				<Badge className="rounded-full px-3 py-1 text-[11px]" variant="outline">
					{todos.length} {todos.length === 1 ? "item" : "items"}
				</Badge>
			</section>

			<Card className="border-border/70 bg-card/95 shadow-sm">
				<CardHeader>
					<CardTitle>Add todo</CardTitle>
					<CardDescription>
						Capture the next piece of work before it slips out of view.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form onSubmit={handleAdd}>
						<FieldGroup>
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
				</CardContent>
			</Card>

			<Card className="border-border/70 bg-card/95 shadow-sm">
				<CardHeader>
					<CardTitle>Current list</CardTitle>
					<CardDescription>
						Use the checkbox to mark work complete or remove stale tasks.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{todos.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
							No todos yet. Add the first task above.
						</div>
					) : (
						todos.map((todo) => (
							<div
								key={todo.id}
								className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-background/60 px-4 py-4"
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
												"block cursor-pointer text-sm font-medium text-foreground",
												todo.completed && "text-muted-foreground line-through",
											)}
											htmlFor={`todo-${todo.id}`}
										>
											{todo.title}
										</label>
										<p className="mt-1 text-xs text-muted-foreground">
											{todo.completed ? "Completed" : "Open task"}
										</p>
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
				</CardContent>
			</Card>
		</div>
	);
}

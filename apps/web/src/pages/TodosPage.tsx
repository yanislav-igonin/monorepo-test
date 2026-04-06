import type { Todo } from "@monorepo-test/shared";
import { type FormEvent, useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createTodoMutationOptions,
	removeTodoMutationOptions,
	updateTodoMutationOptions,
	todosListQueryOptions,
} from "../api/todos";
import {
	Alert,
	Badge,
	Button,
	Center,
	Checkbox,
	Container,
	Group,
	Loader,
	Paper,
	Stack,
	Text,
	TextInput,
	Title,
} from "../components/ui";

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
			<Center py="xl">
				<Stack align="center" gap="xs">
					<Loader size="sm" />
					<Text c="dimmed" size="sm">
						Loading…
					</Text>
				</Stack>
			</Center>
		);
	}

	return (
		<Container px={0} size="lg">
			<Stack gap="lg">
				<Group align="flex-end" justify="space-between">
					<div>
						<Text c="dimmed" fw={600} size="xs" tt="uppercase">
							Tasks
						</Text>
						<Title order={1}>Todos</Title>
						<Text c="dimmed" size="sm">
							Keep the authenticated workspace focused on the next obvious step.
						</Text>
					</div>
					<Badge color="gray" size="lg" variant="light">
						{todos.length} {todos.length === 1 ? "item" : "items"}
					</Badge>
				</Group>

				<Paper p="lg" withBorder>
					<form className="add-todo" onSubmit={handleAdd}>
						<Group align="flex-end">
							<TextInput
								aria-label="Todo title"
								flex={1}
								label="Add todo"
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Ship the authenticated shell"
								value={title}
							/>
							<Button
								leftSection={<Plus aria-hidden="true" size={16} />}
								loading={createTodoMutation.isPending}
								type="submit"
							>
								Add
							</Button>
						</Group>
					</form>

					{actionError || loadError ? (
						<Alert className="error" color="red" mt="md" title="Request failed" variant="light">
							{actionError ?? loadError}
						</Alert>
					) : null}
				</Paper>

				<Paper className="todo-list" p="lg" withBorder>
					<Stack gap="sm">
						{todos.length === 0 ? (
							<Text c="dimmed" size="sm">
								No todos yet. Add the first task above.
							</Text>
						) : (
							todos.map((todo) => (
								<Paper key={todo.id} p="md" radius="sm" withBorder>
									<Group justify="space-between" wrap="nowrap">
										<Checkbox
											aria-label={`Toggle ${todo.title}`}
											checked={todo.completed}
											label={
												<span className={todo.completed ? "done" : undefined}>
													{todo.title}
												</span>
											}
											onChange={() => void toggleCompleted(todo)}
										/>
										<Button
											leftSection={<Trash aria-hidden="true" size={16} />}
											onClick={() => void removeTodo(todo.id)}
											type="button"
											variant="subtle"
										>
											Delete
										</Button>
									</Group>
								</Paper>
							))
						)}
					</Stack>
				</Paper>
			</Stack>
		</Container>
	);
}

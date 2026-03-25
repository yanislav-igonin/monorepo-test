import type { Todo } from "@monorepo-test/shared";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppQueryClient } from "../api/query-client";
import { TodosPage } from "./TodosPage";

const todosMocks = vi.hoisted(() => {
	const listQueryKey = ["todos", "list"] as const;
	const listQueryFn = vi.fn();
	const createTodo = vi.fn();
	const updateTodo = vi.fn();
	const removeTodo = vi.fn();
	const todosListQueryOptions = vi.fn(() => ({
		queryFn: listQueryFn,
		queryKey: listQueryKey,
	}));
	const createTodoMutationOptions = vi.fn(
		(queryClient: {
			invalidateQueries: (options: {
				exact: boolean;
				queryKey: typeof listQueryKey;
			}) => Promise<void>;
		}) => ({
			mutationFn: createTodo,
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					exact: true,
					queryKey: listQueryKey,
				});
			},
		}),
	);
	const updateTodoMutationOptions = vi.fn(
		(queryClient: {
			invalidateQueries: (options: {
				exact: boolean;
				queryKey: typeof listQueryKey;
			}) => Promise<void>;
		}) => ({
			mutationFn: updateTodo,
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					exact: true,
					queryKey: listQueryKey,
				});
			},
		}),
	);
	const removeTodoMutationOptions = vi.fn(
		(queryClient: {
			invalidateQueries: (options: {
				exact: boolean;
				queryKey: typeof listQueryKey;
			}) => Promise<void>;
		}) => ({
			mutationFn: removeTodo,
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					exact: true,
					queryKey: listQueryKey,
				});
			},
		}),
	);

	return {
		listQueryFn,
		todosListQueryOptions,
		createTodoMutationOptions,
		updateTodoMutationOptions,
		removeTodoMutationOptions,
		createTodo,
		updateTodo,
		removeTodo,
	};
});

vi.mock("../api/todos", () => ({
	createTodoMutationOptions: todosMocks.createTodoMutationOptions,
	removeTodoMutationOptions: todosMocks.removeTodoMutationOptions,
	updateTodoMutationOptions: todosMocks.updateTodoMutationOptions,
	todosListQueryOptions: todosMocks.todosListQueryOptions,
}));

function renderTodosPage() {
	const queryClient = createAppQueryClient();

	return render(
		<QueryClientProvider client={queryClient}>
			<TodosPage />
		</QueryClientProvider>,
	);
}

describe("TodosPage", () => {
	beforeEach(() => {
		todosMocks.listQueryFn.mockReset();
		todosMocks.createTodo.mockReset();
		todosMocks.updateTodo.mockReset();
		todosMocks.removeTodo.mockReset();
		todosMocks.todosListQueryOptions.mockClear();
		todosMocks.createTodoMutationOptions.mockClear();
		todosMocks.updateTodoMutationOptions.mockClear();
		todosMocks.removeTodoMutationOptions.mockClear();
	});

	it("loads todos through useQuery and renders them after the loading state", async () => {
		const todos: Todo[] = [
			{
				id: 1,
				title: "Buy milk",
				completed: false,
				createdAt: "2026-03-24T00:00:00.000Z",
			},
		];

		todosMocks.listQueryFn.mockResolvedValueOnce(todos);

		const { container } = renderTodosPage();

		expect(screen.getByText("Loading…")).toBeInTheDocument();

		expect(await screen.findByText("Buy milk")).toBeInTheDocument();
		expect(screen.getByLabelText("Toggle Buy milk")).not.toBeChecked();
		expect(container.querySelector(".add-todo")).toBeInTheDocument();
		expect(container.querySelector(".todo-list")).toBeInTheDocument();
		expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
	});

	it("renders the inline load error when the todos query fails", async () => {
		todosMocks.listQueryFn.mockRejectedValueOnce(new Error("network down"));

		renderTodosPage();

		expect(screen.getByText("Loading…")).toBeInTheDocument();

		const error = await screen.findByText("Failed to load todos");

		expect(error).toHaveClass("error");
	});

	it("creates a todo, invalidates the list query, and resets the input on success", async () => {
		todosMocks.listQueryFn
			.mockResolvedValueOnce([
				{
					id: 1,
					title: "Existing todo",
					completed: false,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
			])
			.mockResolvedValueOnce([
				{
					id: 1,
					title: "Existing todo",
					completed: false,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
				{
					id: 2,
					title: "New todo",
					completed: false,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
			]);
		todosMocks.createTodo.mockResolvedValueOnce({
			id: 2,
			title: "New todo",
			completed: false,
			createdAt: "2026-03-24T00:00:00.000Z",
		});

		renderTodosPage();

		expect(await screen.findByText("Existing todo")).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText("Todo title"), {
			target: { value: "New todo" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Add" }));

		await waitFor(() => {
			expect(todosMocks.createTodo).toHaveBeenCalledWith(
				{ title: "New todo" },
				expect.anything(),
			);
		});

		expect(await screen.findByText("New todo")).toBeInTheDocument();
		expect(screen.getByText("Existing todo")).toBeInTheDocument();
		expect(screen.getByLabelText("Toggle New todo")).toBeInTheDocument();
		expect(todosMocks.listQueryFn.mock.calls.length).toBeGreaterThanOrEqual(2);
		expect(
			(screen.getByLabelText("Todo title") as HTMLInputElement).value,
		).toBe("");
	});

	it("toggles a todo through a mutation and refreshes the list", async () => {
		todosMocks.listQueryFn
			.mockResolvedValueOnce([
				{
					id: 1,
					title: "Existing todo",
					completed: false,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
			])
			.mockResolvedValueOnce([
				{
					id: 1,
					title: "Existing todo",
					completed: true,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
			]);
		todosMocks.updateTodo.mockResolvedValueOnce({
			id: 1,
			title: "Existing todo",
			completed: true,
			createdAt: "2026-03-24T00:00:00.000Z",
		});

		renderTodosPage();

		expect(await screen.findByText("Existing todo")).toBeInTheDocument();

		fireEvent.click(screen.getByLabelText("Toggle Existing todo"));

		await waitFor(() => {
			expect(todosMocks.updateTodo).toHaveBeenCalledWith(
				{ id: 1, completed: true },
				expect.anything(),
			);
		});

		expect(await screen.findByLabelText("Toggle Existing todo")).toBeChecked();
		expect(screen.getByText("Existing todo")).toHaveClass("done");
	});

	it("deletes a todo through a mutation and refreshes the list", async () => {
		todosMocks.listQueryFn
			.mockResolvedValueOnce([
				{
					id: 1,
					title: "Keep me",
					completed: false,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
				{
					id: 2,
					title: "Remove me",
					completed: false,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
			])
			.mockResolvedValueOnce([
				{
					id: 1,
					title: "Keep me",
					completed: false,
					createdAt: "2026-03-24T00:00:00.000Z",
				},
			]);
		todosMocks.removeTodo.mockResolvedValueOnce({
			id: 2,
			title: "Remove me",
			completed: false,
			createdAt: "2026-03-24T00:00:00.000Z",
		});

		renderTodosPage();

		expect(await screen.findByText("Keep me")).toBeInTheDocument();
		expect(screen.getByText("Remove me")).toBeInTheDocument();

		fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[1]);

		await waitFor(() => {
			expect(todosMocks.removeTodo).toHaveBeenCalledWith(
				{ id: 2 },
				expect.anything(),
			);
		});

		expect(await screen.findByText("Keep me")).toBeInTheDocument();
		expect(screen.queryByText("Remove me")).not.toBeInTheDocument();
	});

	it("shows inline update or delete errors while keeping the last good list rendered", async () => {
		todosMocks.listQueryFn.mockResolvedValueOnce([
			{
				id: 1,
				title: "Existing todo",
				completed: false,
				createdAt: "2026-03-24T00:00:00.000Z",
			},
		]);
		todosMocks.updateTodo.mockRejectedValueOnce(new Error("network down"));
		todosMocks.removeTodo.mockRejectedValueOnce(new Error("still down"));

		renderTodosPage();

		expect(await screen.findByText("Existing todo")).toBeInTheDocument();

		fireEvent.click(screen.getByLabelText("Toggle Existing todo"));

		await waitFor(() => {
			expect(todosMocks.updateTodo).toHaveBeenCalledWith(
				{ id: 1, completed: true },
				expect.anything(),
			);
		});

		expect(await screen.findByText("Failed to update todo")).toHaveClass(
			"error",
		);
		expect(screen.getByText("Existing todo")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Delete" }));

		await waitFor(() => {
			expect(todosMocks.removeTodo).toHaveBeenCalledWith(
				{ id: 1 },
				expect.anything(),
			);
		});

		expect(await screen.findByText("Failed to delete todo")).toHaveClass(
			"error",
		);
		expect(screen.getByText("Existing todo")).toBeInTheDocument();
	});

	it("shows an inline create error and keeps the current todos visible on failure", async () => {
		todosMocks.listQueryFn.mockResolvedValueOnce([
			{
				id: 1,
				title: "Existing todo",
				completed: false,
				createdAt: "2026-03-24T00:00:00.000Z",
			},
		]);
		todosMocks.createTodo.mockRejectedValueOnce(new Error("network down"));

		renderTodosPage();

		expect(await screen.findByText("Existing todo")).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText("Todo title"), {
			target: { value: "Broken todo" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Add" }));

		await waitFor(() => {
			expect(todosMocks.createTodo).toHaveBeenCalledWith(
				{ title: "Broken todo" },
				expect.anything(),
			);
		});

		const error = await screen.findByText("Failed to create todo");

		expect(error).toHaveClass("error");
		expect(screen.getByText("Existing todo")).toBeInTheDocument();
		expect(
			(screen.getByLabelText("Todo title") as HTMLInputElement).value,
		).toBe("Broken todo");
	});
});

import type { QueryClient } from "@tanstack/react-query";
import { orpcQuery } from "./orpc";

const todosListInput = {} as const;

export function todosListQueryOptions() {
  return orpcQuery.todos.list.queryOptions({
    input: todosListInput,
  });
}

export function todosListQueryKey() {
  return orpcQuery.todos.list.queryKey({
    input: todosListInput,
  });
}

function invalidateTodosList(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    exact: true,
    queryKey: todosListQueryKey(),
  });
}

export function createTodoMutationOptions(queryClient: QueryClient) {
  return orpcQuery.todos.create.mutationOptions({
    async onSuccess() {
      await invalidateTodosList(queryClient);
    },
  });
}

export function updateTodoMutationOptions(queryClient: QueryClient) {
  return orpcQuery.todos.update.mutationOptions({
    async onSuccess() {
      await invalidateTodosList(queryClient);
    },
  });
}

export function removeTodoMutationOptions(queryClient: QueryClient) {
  return orpcQuery.todos.remove.mutationOptions({
    async onSuccess() {
      await invalidateTodosList(queryClient);
    },
  });
}

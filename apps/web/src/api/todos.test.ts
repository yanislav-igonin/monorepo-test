import type { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import {
  createTodoMutationOptions,
  removeTodoMutationOptions,
  todosListQueryKey,
  todosListQueryOptions,
  updateTodoMutationOptions,
} from "./todos";

describe("todosListQueryKey", () => {
  it("returns a stable query key for todos.list with empty input", () => {
    const firstKey = todosListQueryKey();
    const secondKey = todosListQueryKey();
    const options = todosListQueryOptions();

    expect(firstKey).toEqual(secondKey);
    expect(options.queryKey).toEqual(firstKey);
  });
});

describe("todo mutation options", () => {
  it("invalidates the todos list key after create update and remove", async () => {
    const invalidateQueries = vi.fn().mockResolvedValue(undefined);
    const queryClient = {
      invalidateQueries,
    } as unknown as QueryClient;

    await createTodoMutationOptions(queryClient).onSuccess?.(
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
    );
    await updateTodoMutationOptions(queryClient).onSuccess?.(
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
    );
    await removeTodoMutationOptions(queryClient).onSuccess?.(
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
    );

    expect(invalidateQueries).toHaveBeenCalledTimes(3);
    expect(invalidateQueries).toHaveBeenNthCalledWith(1, {
      exact: true,
      queryKey: todosListQueryKey(),
    });
    expect(invalidateQueries).toHaveBeenNthCalledWith(2, {
      exact: true,
      queryKey: todosListQueryKey(),
    });
    expect(invalidateQueries).toHaveBeenNthCalledWith(3, {
      exact: true,
      queryKey: todosListQueryKey(),
    });
  });
});

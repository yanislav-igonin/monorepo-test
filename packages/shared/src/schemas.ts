import { z } from "zod";

/** Todo row as returned by list/create/update RPC procedures. */
export const todoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Todo = z.infer<typeof todoSchema>;

export const todoListSchema = z.array(todoSchema);

/** create todo RPC input */
export const createTodoBodySchema = z.object({
  title: z.string().min(1, "Title must not be empty"),
});

export type CreateTodoBody = z.infer<typeof createTodoBodySchema>;

/** patch todo body — at least one field */
export const patchTodoBodySchema = z
  .object({
    title: z.string().min(1, "Title must not be empty").optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (body) => body.title !== undefined || body.completed !== undefined,
    { message: "Provide title and/or completed" },
  );

export type PatchTodoBody = z.infer<typeof patchTodoBodySchema>;

/** RPC input for todo update (id + at least one of title / completed). */
export const updateTodoInputSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string().min(1, "Title must not be empty").optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (body) => body.title !== undefined || body.completed !== undefined,
    { message: "Provide title and/or completed" },
  );

export type UpdateTodoInput = z.infer<typeof updateTodoInputSchema>;

/** id-only input (e.g. remove todo RPC) */
export const todoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type TodoIdParam = z.infer<typeof todoIdParamSchema>;

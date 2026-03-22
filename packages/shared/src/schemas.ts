import { z } from "zod";

/** Todo row as returned by GET /api/todos and mutations. */
export const todoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Todo = z.infer<typeof todoSchema>;

export const todoListSchema = z.array(todoSchema);

/** POST /api/todos body */
export const createTodoBodySchema = z.object({
  title: z.string().min(1, "Title must not be empty"),
});

export type CreateTodoBody = z.infer<typeof createTodoBodySchema>;

/** PATCH /api/todos/:id body — at least one field */
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

/** Path param for /api/todos/:id */
export const todoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type TodoIdParam = z.infer<typeof todoIdParamSchema>;

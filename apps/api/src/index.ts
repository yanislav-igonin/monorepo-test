import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import {
  createTodoBodySchema,
  patchTodoBodySchema,
  todoIdParamSchema,
} from "@monorepo-test/shared";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/index.js";
import { todos } from "./db/schema.js";
import type { Todo } from "@monorepo-test/shared";
import type { TodoRow } from "./db/schema.js";

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.createdAt,
  };
}

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

const todosApi = new Hono()
  .get("/", (c) => {
    const rows = db.select().from(todos).all();
    return c.json(rows.map(rowToTodo));
  })
  .post("/", zValidator("json", createTodoBodySchema), (c) => {
    const { title } = c.req.valid("json");
    const createdAt = new Date().toISOString();
    const [row] = db
      .insert(todos)
      .values({ title, completed: false, createdAt })
      .returning()
      .all();
    if (!row) {
      return c.json({ error: "Failed to create todo" }, 500);
    }
    return c.json(rowToTodo(row), 201);
  })
  .patch(
    "/:id",
    zValidator("param", todoIdParamSchema),
    zValidator("json", patchTodoBodySchema),
    (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const [existing] = db.select().from(todos).where(eq(todos.id, id)).all();
      if (!existing) {
        return c.json({ error: "Not found" }, 404);
      }
      const [row] = db
        .update(todos)
        .set({
          title: body.title ?? existing.title,
          completed: body.completed ?? existing.completed,
        })
        .where(eq(todos.id, id))
        .returning()
        .all();
      if (!row) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json(rowToTodo(row));
    },
  )
  .delete("/:id", zValidator("param", todoIdParamSchema), (c) => {
    const { id } = c.req.valid("param");
    const [removed] = db.delete(todos).where(eq(todos.id, id)).returning().all();
    if (!removed) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.newResponse(null, 204);
  });

app.route("/api/todos", todosApi);

const port = Number(process.env.PORT) || 3001;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API listening on http://localhost:${info.port}`);
  },
);

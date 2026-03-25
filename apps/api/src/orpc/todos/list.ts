import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";
import type { AuthenticatedContext } from "../base.js";
import { rowToTodo } from "./helpers.js";

interface TodoListOptions {
	context: AuthenticatedContext;
}

export async function todoList({ context }: TodoListOptions) {
	const rows = db
		.select()
		.from(todos)
		.where(eq(todos.userId, context.session.user.id))
		.all();

	return rows.map(rowToTodo);
}

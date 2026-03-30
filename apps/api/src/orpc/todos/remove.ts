import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";
import type { AuthenticatedContext } from "../base.js";

type TodoRemoveOptions = {
	input: { id: number };
	context: AuthenticatedContext;
};

export async function todoRemove({ input, context }: TodoRemoveOptions) {
	const { id } = input;
	const [removed] = db
		.delete(todos)
		.where(and(eq(todos.id, id), eq(todos.userId, context.session.user.id)))
		.returning()
		.all();
	if (!removed) {
		throw new ORPCError("NOT_FOUND", { message: "Not found" });
	}
}

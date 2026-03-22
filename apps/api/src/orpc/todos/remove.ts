import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";

export async function todoRemove(input: { id: number }) {
  const { id } = input;
  const [removed] = db.delete(todos).where(eq(todos.id, id)).returning().all();
  if (!removed) {
    throw new ORPCError("NOT_FOUND", { message: "Not found" });
  }
}

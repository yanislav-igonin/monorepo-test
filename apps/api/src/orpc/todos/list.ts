import { db } from "../../db/index.js";
import { todos } from "../../db/schema.js";
import { rowToTodo } from "./helpers.js";

export async function todoList() {
  const rows = db.select().from(todos).all();
  return rows.map(rowToTodo);
}

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as schema from "./schema.js";

const here = dirname(fileURLToPath(import.meta.url));
const defaultPath = join(here, "..", "..", "data", "local.db");
const dbPath = process.env.DATABASE_URL ?? defaultPath;

mkdirSync(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

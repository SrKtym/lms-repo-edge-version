import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export function createDb() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}
	const pool = new Pool({
		connectionString,
		maxUses: 1,
	});
	return drizzle(pool, { schema });
}

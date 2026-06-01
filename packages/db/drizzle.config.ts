import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const env = process.env.NODE_ENV || "development";
dotenv.config({
	path: `../../apps/server/.env.${env}`,
});

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});

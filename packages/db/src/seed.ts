import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from "dotenv";

const envResult = dotenv.config({
	path: join(__dirname, "../../../apps/server/.env.development"),
});

if (envResult.error) {
	throw envResult.error;
}

import { seedCourseData } from "./seed/seed-course-data";
import { seedUserData } from "./seed/seed-prof-data";

async function main() {
	await seedUserData();
	await seedCourseData();
}

main();

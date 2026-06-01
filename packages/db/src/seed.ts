import { seedCourseData } from "./seed/seed-course-data";
import { seedUserData } from "./seed/seed-prof-data";

async function main() {
	await seedUserData();
	await seedCourseData();
}

main();

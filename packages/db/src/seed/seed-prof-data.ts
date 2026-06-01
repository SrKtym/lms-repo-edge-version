import { createDb } from "../index";
import { mockProfessors } from "../mock/mock-prof-data";
import { user } from "../schema";

export async function seedUserData() {
	await createDb().insert(user).values(mockProfessors).onConflictDoNothing();
}

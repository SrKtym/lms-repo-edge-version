import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import { departments, students } from "../../schema";

// 学生の所属（学年、学科）を登録する
export async function registerStudentData(
	userId: string,
	departmentName: string,
	grade: number,
) {
	try {
		await createDb().transaction(async (tx) => {
			const departmentId = await tx
				.select({ id: departments.id })
				.from(departments)
				.where(eq(departments.name, departmentName))
				.limit(1);

			if (!departmentId[0]) {
				return { message: "学科が見つかりません。", status: 404 };
			}

			await tx
				.insert(students)
				.values({
					id: userId,
					departmentId: departmentId[0].id,
					grade,
				})
				.onConflictDoNothing();
		});
		return { message: "学生の所属登録に成功しました。", status: 201 };
	} catch {
		return { message: "学生の所属登録に失敗しました。", status: 500 };
	}
}

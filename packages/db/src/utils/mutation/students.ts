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

			function getRequiredCredits(departmentName: string): number {
				switch (departmentName) {
					case "医学科":
						return 200;
					case "看護学科":
						return 140;
					case "保健学科":
						return 140;
					default:
						return 130;
				}
			}

			const requiredCredits = getRequiredCredits(departmentName);

			await tx
				.insert(students)
				.values({
					id: userId,
					departmentId: departmentId[0].id,
					departmentName: departmentName,
					grade,
					requiredCredits,
				})
				.onConflictDoNothing();
		});
		return { message: "学生の所属登録に成功しました。", status: 201 };
	} catch (error) {
		return { message: "学生の所属登録に失敗しました。", status: 500 };
	}
}

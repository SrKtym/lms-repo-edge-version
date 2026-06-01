import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import {
	departments,
	faculties,
	registration,
	students,
	user,
} from "../../schema";

// 学籍情報の取得
export async function fetchStudentData(userId: string) {
	const student = await createDb()
		.select({
			department: departments.name,
			faculty: faculties.name,
			grade: students.grade,
			requiredCredit: students.requiredCredits,
		})
		.from(students)
		.innerJoin(departments, eq(students.departmentId, departments.id))
		.innerJoin(faculties, eq(departments.facultyId, faculties.id))
		.where(eq(students.id, userId))
		.limit(1);

	return student;
}

export type FetchStudentDataReturnType = Awaited<
	ReturnType<typeof fetchStudentData>
>;

// 講義を登録しているメンバーの取得
export async function fetchMembersByCourseId(courseId: string) {
	const members = await createDb()
		.select({
			id: students.id,
			name: user.name,
			grade: students.grade,
			avatar: user.image,
		})
		.from(students)
		.innerJoin(user, eq(students.id, user.id))
		.innerJoin(registration, eq(students.id, registration.userId))
		.where(eq(registration.courseId, courseId));

	return members;
}

export type FetchMembersFromUserCoursesReturnType = Awaited<
	ReturnType<typeof fetchMembersByCourseId>
>;

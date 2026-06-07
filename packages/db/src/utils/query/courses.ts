import { and, eq, lte, or, sql } from "drizzle-orm";
import { createDb } from "../../index";
import {
	courses,
	departments,
	registration,
	students,
	user,
} from "../../schema";

// 学生が所属する学科に基づき、登録可能な講義のみを取得する
export async function fetchCourses(
	userId: string,
	weekdays: number,
	period: number,
	limit = 10,
	offset = 0,
) {
	// ユーザーの学科情報を取得
	const studentInfo = await createDb()
		.select({
			departmentId: students.departmentId,
			grade: students.grade,
		})
		.from(students)
		.where(eq(students.id, userId))
		.limit(1);

	if (!studentInfo[0]) {
		return [];
	}

	const { departmentId, grade } = studentInfo[0];

	// 登録可能な講義を取得（サブクエリで履修済み講義を除外）
	const courseList = await createDb()
		.select({
			id: courses.id,
			name: courses.name,
			weekdays: courses.weekdays,
			period: courses.period,
			credits: courses.credits,
			targetGrade: courses.targetGrade,
			requirements: courses.requirements,
			classRoom: courses.classRoom,
			professor: user.name,
		})
		.from(courses)
		.innerJoin(departments, eq(courses.departmentId, departments.id))
		.innerJoin(user, eq(courses.professorId, user.id))
		.leftJoin(
			registration,
			and(
				eq(courses.id, registration.courseId),
				eq(registration.userId, userId),
				eq(registration.isCompleted, true),
			),
		)
		.where(
			and(
				eq(courses.weekdays, weekdays),
				eq(courses.period, period),
				lte(courses.targetGrade, grade),
				sql`${registration.courseId} IS NULL`,
				or(eq(departments.id, departmentId), eq(departments.name, "全学科")),
			),
		)
		.limit(limit)
		.offset(offset);

	return courseList;
}

// 学生が登録する講義を取得する
export async function fetchRegisteredCourses(userId: string) {
	const registeredCourseList = await createDb()
		.select({
			id: courses.id,
			name: courses.name,
			weekdays: courses.weekdays,
			period: courses.period,
			credits: courses.credits,
			targetGrade: courses.targetGrade,
			requirements: courses.requirements,
			classRoom: courses.classRoom,
			professor: user.name,
			isChecked: registration.isChecked,
		})
		.from(courses)
		.innerJoin(registration, eq(courses.id, registration.courseId))
		.innerJoin(user, eq(courses.professorId, user.id))
		.where(eq(registration.userId, userId));

	return registeredCourseList;
}

// 学生が修了した講義の単位数の合計を取得する
export async function fetchCompletedCourses(userId: string) {
	const completedCoursesCredits = await createDb()
		.select({
			totalCredits: sql<number>`sum(${courses.credits})`,
		})
		.from(courses)
		.innerJoin(registration, eq(courses.id, registration.courseId))
		.where(
			and(eq(registration.userId, userId), eq(registration.isCompleted, true)),
		);

	return completedCoursesCredits;
}

export type FetchCoursesReturnType = Awaited<ReturnType<typeof fetchCourses>>;
export type FetchRegisteredCoursesReturnType = Awaited<
	ReturnType<typeof fetchRegisteredCourses>
>;
export type FetchCompletedCoursesReturnType = Awaited<
	ReturnType<typeof fetchCompletedCourses>
>;

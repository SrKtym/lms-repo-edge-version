import { and, eq, inArray, lte, or, sql } from "drizzle-orm";
import { createDb } from "../../index";
import {
	courses,
	departments,
	faculties,
	registration,
	students,
	user,
} from "../../schema";

// 学生が所属する学部に基づき、登録可能な講義のみを取得する
export async function fetchCourses(
	weekdays: number,
	period: number,
	limit = 10,
	offset = 0,
	userId: string,
) {
	const result = await createDb().transaction(async (tx) => {
		// 学生が所属する学部を取得
		const userFaculties = await tx
			.select({
				id: faculties.id,
				name: faculties.name,
			})
			.from(faculties)
			.innerJoin(departments, eq(faculties.id, departments.facultyId))
			.innerJoin(students, eq(departments.id, students.departmentId))
			.where(eq(students.id, userId))
			.limit(1);

		const facultyId = userFaculties.map((f) => f.id);
		const isMedicine = userFaculties.some((f) => f.name === "医学部");

		// 登録可能な講義を取得
		const courseList = await tx
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
			.innerJoin(user, eq(courses.professorId, user.id))
			.innerJoin(departments, eq(courses.departmentId, departments.id))
			.innerJoin(faculties, eq(departments.facultyId, faculties.id))
			.innerJoin(students, lte(courses.targetGrade, students.grade))
			.where(
				and(
					eq(courses.weekdays, weekdays),
					eq(courses.period, period),
					or(
						isMedicine
							? eq(departments.id, students.departmentId)
							: inArray(faculties.id, facultyId),
						eq(departments.name, "全学科"),
					),
				),
			)
			.limit(limit)
			.offset(offset);

		return courseList;
	});

	return result;
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

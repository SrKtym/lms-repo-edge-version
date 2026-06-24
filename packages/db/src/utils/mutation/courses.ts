import { and, eq, lte, or, sql } from "drizzle-orm";
import { createDb } from "../../index";
import {
	courses,
	departments,
	notifications,
	registration,
	students,
} from "../../schema";
import type { Courses } from "../../types";

// 講義を作成する
export async function createCourses(coursesData: Courses) {
	try {
		await createDb().insert(courses).values(coursesData).onConflictDoNothing();
		return { message: "講義の作成に成功しました。", status: 201 };
	} catch {
		return { message: "講義の作成に失敗しました。", status: 500 };
	}
}

// 講義を登録する
export async function registerCourses(courseId: string, userId: string) {
	try {
		const result = await createDb().transaction(async (tx) => {
			// 登録しようとする講義の曜日・時限・単位数を取得
			const targetCourse = await tx
				.select({
					weekdays: courses.weekdays,
					period: courses.period,
					credits: courses.credits,
				})
				.from(courses)
				.where(eq(courses.id, courseId))
				.limit(1);

			if (targetCourse.length === 0 || !targetCourse[0]) {
				return { message: "指定された講義が見つかりません。", status: 404 };
			}

			const { weekdays, period, credits } = targetCourse[0];

			// ユーザーの学科情報を取得
			const studentInfo = await tx
				.select({
					departmentId: students.departmentId,
					grade: students.grade,
				})
				.from(students)
				.where(eq(students.id, userId))
				.limit(1);

			if (!studentInfo[0]) {
				return { message: "学生情報が見つかりません。", status: 404 };
			}

			const { departmentId, grade } = studentInfo[0];

			// 1. 同じ曜日・時限に必修の講義があるか確認する
			const requiredCourses = await tx
				.select({
					courseId: courses.id,
					courseName: courses.name,
					targetGrade: courses.targetGrade,
				})
				.from(courses)
				.innerJoin(departments, eq(courses.departmentId, departments.id))
				.where(
					and(
						eq(courses.weekdays, weekdays),
						eq(courses.period, period),
						eq(courses.requirements, "必修"),
						lte(courses.targetGrade, grade),
						or(
							eq(departments.id, departmentId),
							eq(departments.name, "全学科"),
						),
					),
				);

			// 1-1. 同じ曜日・時限に必修の講義が1件だけ存在する場合
			if (requiredCourses.length === 1) {
				const requiredCourseName = requiredCourses[0]?.courseName;
				const selectedIsNotRequied = requiredCourses.some(
					(course) => course.courseId !== courseId,
				);
				if (requiredCourseName && selectedIsNotRequied) {
					return {
						message: `同じ曜日・時限に必修の講義「${requiredCourseName}」が存在するため、登録できません。`,
						status: 400,
					};
				}
			}

			// 1-2. 同じ曜日・時限に必修の講義が2件以上存在する場合、最も対象学年が低い講義を優先して登録する
			if (requiredCourses.length > 1) {
				const minGrade = Math.min(...requiredCourses.map((c) => c.targetGrade));
				const lowestGradeCourses = requiredCourses.filter(
					(course) => course.targetGrade === minGrade,
				);
				const selectedIsRequired = requiredCourses.some(
					(course) => course.courseId === courseId,
				);
				const selectedIsLowest = lowestGradeCourses.some(
					(course) => course.courseId === courseId,
				);

				if (!selectedIsRequired) {
					return {
						message:
							"同じ曜日・時限に複数の必修の講義が存在するため、登録できません。",
						status: 400,
					};
				}
				if (selectedIsRequired && !selectedIsLowest) {
					return {
						message:
							"必修講義が複数存在する場合は、対象学年がより低い方を優先して登録してください。",
						status: 400,
					};
				}
			}

			// 2. ユーザーが登録する講義の総単位数が50以上になる場合、登録を中止する
			const total = await tx
				.select({
					totalCredits: sql<number>`sum(${courses.credits})`,
				})
				.from(courses)
				.innerJoin(registration, eq(courses.id, registration.courseId))
				.where(eq(registration.userId, userId));

			const currentValue = Number(total[0]?.totalCredits ?? 0);
			const totalCredits = currentValue + credits;

			if (totalCredits >= 50) {
				return {
					message: `登録できる講義の単位数の上限に達しています。（現在: ${currentValue}単位 + 登録予定: ${credits}単位）`,
					status: 400,
				};
			}

			// 3. ユーザーが既に同じ曜日・時限の講義を登録していないかチェック
			const conflictingCourse = await tx
				.select({
					courseId: courses.id,
				})
				.from(registration)
				.innerJoin(courses, eq(registration.courseId, courses.id))
				.where(
					and(
						eq(registration.userId, userId),
						eq(courses.weekdays, weekdays),
						eq(courses.period, period),
					),
				)
				.limit(1);

			// 3-1. 重複がある場合、登録講義を更新する
			if (conflictingCourse.length > 0) {
				const existingCourse = conflictingCourse[0];
				if (existingCourse?.courseId === courseId) {
					return {
						message: "既に同じ講義を登録しています。",
						status: 400,
					};
				}
				if (existingCourse) {
					await tx
						.update(registration)
						.set({
							courseId,
						})
						.where(
							and(
								eq(registration.courseId, existingCourse.courseId),
								eq(registration.userId, userId),
							),
						);

					return {
						message: "登録講義の更新に成功しました。",
						status: 200,
					};
				}
			}

			// 重複がなければ講義を登録
			await tx
				.insert(registration)
				.values({
					userId,
					courseId,
				})
				.onConflictDoNothing();

			return { message: "講義の登録に成功しました。", status: 201 };
		});

		return result;
	} catch {
		return { message: "講義の登録に失敗しました。", status: 500 };
	}
}

// 登録講義を確定する
export async function checkCourse(userId: string) {
	try {
		await createDb().transaction(async (tx) => {
			// 履修登録の完了
			await tx
				.update(registration)
				.set({ isChecked: true })
				.where(eq(registration.userId, userId));

			// 通知の作成
			await tx
				.insert(notifications)
				.values({
					title: "履修登録が完了しました。",
					description: "指定された期日まで登録内容を編集することができます。",
					sender: "system",
					receiver: "students",
				})
				.onConflictDoNothing();
		});

		return { message: "登録講義の確定に成功しました。", status: 200 };
	} catch {
		return { message: "登録講義の確定に失敗しました。", status: 500 };
	}
}

// 講義を登録解除する
export async function unregisterCourse(courseId: string, userId: string) {
	try {
		await createDb()
			.delete(registration)
			.where(
				and(
					eq(registration.courseId, courseId),
					eq(registration.userId, userId),
				),
			);
		return { message: "講義の登録解除に成功しました。", status: 200 };
	} catch {
		return { message: "講義の登録解除に失敗しました。", status: 500 };
	}
}

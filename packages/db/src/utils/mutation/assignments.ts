import { and, eq } from "drizzle-orm";
import { createDb } from "../../index";
import {
	assignments,
	courses,
	emailNotificationSettings,
	notifications,
	registration,
	user,
} from "../../schema";
import type { Assignments } from "../../types";

// 課題の作成
export async function createAssignments(
	assignmentsData: Assignments,
	userId: string,
) {
	try {
		const result = await createDb().transaction(async (tx) => {
			// 課題の作成と取得
			const result = await tx
				.insert(assignments)
				.values(assignmentsData)
				.returning({
					title: assignments.title,
					description: assignments.description,
					points: assignments.points,
					dueDate: assignments.dueDate,
					format: assignments.format,
					courseId: assignments.courseId,
				})
				.onConflictDoNothing();

			const courseId = result[0]?.courseId;

			if (!courseId) {
				return { message: "講義が見つかりません", status: 404 };
			}

			const courseName = await tx
				.select({ name: courses.name })
				.from(courses)
				.where(eq(courses.id, courseId))
				.limit(1);

			const notificationsData = result.map((v) => ({
				title: `${courseName[0]?.name}に新しい課題: ${v.title}`,
				description: `提出形式: ${v.format}\n説明: ${v.description}`,
				sender: userId,
				receiver: v.courseId,
			}));

			// 通知の作成
			await tx
				.insert(notifications)
				.values(notificationsData)
				.onConflictDoNothing();

			// メール通知を有効にしているユーザーのメール一覧
			const res = await tx
				.select({
					email: user.email,
				})
				.from(user)
				.innerJoin(
					emailNotificationSettings,
					eq(user.id, emailNotificationSettings.userId),
				)
				.innerJoin(
					registration,
					eq(emailNotificationSettings.userId, registration.userId),
				)
				.where(
					and(
						eq(registration.courseId, courseId),
						eq(emailNotificationSettings.assignmentsEmail, true),
					),
				);

			const emails = res.map(({ email }) => email);

			const merged = result.map(
				({ title, description, points, format, dueDate }) => ({
					title,
					description,
					points,
					format,
					dueDate,
					emails,
				}),
			);

			return merged;
		});
		return result;
	} catch {
		return { message: "課題の作成に失敗しました。", status: 500 };
	}
}

// 課題の更新
export async function updateAssignments(assignmentsData: Assignments) {
	try {
		await createDb().update(assignments).set(assignmentsData);
		return { message: "課題の更新に成功しました。", status: 200 };
	} catch {
		return { message: "課題の更新に失敗しました。", status: 500 };
	}
}

// 課題の削除
export async function deleteAssignments(assignmentId: string) {
	try {
		await createDb()
			.delete(assignments)
			.where(eq(assignments.id, assignmentId));
		return { message: "課題の削除に成功しました。", status: 200 };
	} catch {
		return { message: "課題の削除に失敗しました。", status: 500 };
	}
}

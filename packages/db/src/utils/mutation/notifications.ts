import { and, eq, gt, inArray, lte } from "drizzle-orm";
import { createDb } from "../../index";
import {
	assignments,
	courses,
	emailNotificationSettings,
	notifications,
	registration,
	user,
} from "../../schema";
import type { Notifications } from "../../types";

export async function createNotifications(notificationsData: Notifications) {
	try {
		await createDb().insert(notifications).values(notificationsData);
		return { message: "通知の作成に成功しました。", status: 201 };
	} catch {
		return { message: "通知の作成に失敗しました。", status: 500 };
	}
}

export async function deleteNotification(notificationId: string) {
	try {
		await createDb()
			.delete(notifications)
			.where(eq(notifications.id, notificationId));
		return { message: "通知の削除に成功しました。", status: 200 };
	} catch {
		return { message: "通知の削除に失敗しました。", status: 500 };
	}
}

export async function markNotificationAsRead(notificationId: string) {
	try {
		await createDb()
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.id, notificationId));
		return { message: "通知の既読処理に成功しました。", status: 200 };
	} catch {
		return { message: "通知の既読処理に失敗しました。", status: 500 };
	}
}

export async function markAllNotificationsAsRead() {
	try {
		await createDb().update(notifications).set({ isRead: true });
		return { message: "通知の既読処理に成功しました。", status: 200 };
	} catch {
		return { message: "通知の既読処理に失敗しました。", status: 500 };
	}
}

// リマインダーの作成
export async function createReminder(userId: string) {
	const now = new Date();

	// 3日後
	const target = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

	try {
		const result = await createDb().transaction(async (tx) => {
			const tasks = await tx
				.select({
					title: assignments.title,
					description: assignments.description,
					courseId: courses.id,
				})
				.from(assignments)
				.innerJoin(courses, eq(assignments.courseId, courses.id))
				.innerJoin(registration, eq(courses.id, registration.courseId))
				.where(
					and(
						eq(registration.userId, userId),
						lte(assignments.dueDate, target),
						gt(assignments.dueDate, now),
					),
				);

			if (tasks.length > 0) {
				const notificationsData = tasks.map((v) => ({
					title: `リマインダー: ${v.title}`,
					description: v.description,
					sender: "system",
					receiver: v.courseId,
				}));

				await tx
					.insert(notifications)
					.values(notificationsData)
					.onConflictDoNothing();

				const courseIds = tasks.map((v) => v.courseId);

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
							inArray(registration.courseId, courseIds),
							eq(emailNotificationSettings.remindersEmail, true),
						),
					);

				const emails = res.map(({ email }) => email);

				return emails;
			}
			return { message: "該当するタスクが見つかりません。", status: 404 };
		});

		return result;
	} catch {
		return { message: "リマインダーの作成に失敗しました。", status: 500 };
	}
}

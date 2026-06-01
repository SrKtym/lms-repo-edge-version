import { and, eq } from "drizzle-orm";
import { createDb } from "../../index";
import {
	announcements,
	courses,
	emailNotificationSettings,
	notifications,
	registration,
	user,
} from "../../schema";
import type { Announcements } from "../../types";

// アナウンスメント作成
export async function createAnnouncements(
	announcementsData: Announcements,
	userId: string,
) {
	try {
		const result = await createDb().transaction(async (tx) => {
			// アナウンスメントの作成と取得
			const result = await tx
				.insert(announcements)
				.values(announcementsData)
				.returning({
					title: announcements.title,
					description: announcements.description,
					type: announcements.type,
					courseId: announcements.courseId,
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
				title: `${courseName[0]?.name}に新しいお知らせ: ${v.title}`,
				description: `${v.type}: ${v.description}`,
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
						eq(emailNotificationSettings.announcementsEmail, true),
					),
				);

			const emails = res.map(({ email }) => email);

			const merged = result.map(({ title, description, type }) => ({
				title,
				description,
				type,
				emails,
			}));

			return merged;
		});
		return result;
	} catch {
		return { message: "アナウンスメントの作成に失敗しました。", status: 500 };
	}
}

// アナウンスメント更新
export async function updateAnnouncements(announcementsData: Announcements) {
	try {
		await createDb().update(announcements).set(announcementsData);
		return { message: "アナウンスメントの更新に成功しました。", status: 200 };
	} catch {
		return { message: "アナウンスメントの更新に失敗しました。", status: 500 };
	}
}

// アナウンスメント削除
export async function deleteAnnouncements(id: string) {
	try {
		await createDb().delete(announcements).where(eq(announcements.id, id));
		return { message: "アナウンスメントの削除に成功しました。", status: 200 };
	} catch {
		return { message: "アナウンスメントの削除に失敗しました。", status: 500 };
	}
}

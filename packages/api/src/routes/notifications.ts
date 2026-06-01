import type { Session } from "@lms-repo/auth/server";
import {
	createReminder,
	deleteNotification,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "@lms-repo/db/utils/mutation/notifications";
import { fetchNotifications } from "@lms-repo/db/utils/query/notifications";
import { resend } from "@lms-repo/emails";
import { Hono } from "hono";

// 通知に関するロジック
export const notificationsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// 通知作成
	.post("/", (c) => {
		return c.json({ message: "notification created" }, 201);
	})
	// 通知取得
	.get("/", async (c) => {
		const { userId } = c.get("session");
		const notificationList = await fetchNotifications(userId);
		return c.json(notificationList, 200);
	})
	// 通知既読
	.patch("/:id/mark_as_read", async (c) => {
		const id = c.req.param("id");
		const result = await markNotificationAsRead(id);
		return c.json(result);
	})
	// すべての通知を既読
	.patch("/mark_all_as_read", async (c) => {
		const result = await markAllNotificationsAsRead();
		return c.json(result);
	})
	// 通知削除
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		const result = await deleteNotification(id);
		return c.json(result);
	})
	// リマインダーの作成（このエンドポイントはCloud Schedulerによって定期実行される）
	.post("/reminder", async (c) => {
		const { userId } = c.get("session");
		const result = await createReminder(userId);

		if ("message" in result) {
			return c.json(result);
		}

		if (result.length > 0) {
			await resend.emails.send({
				from: "onboarding@resend.dev",
				to: result,
				subject: "Hello world",
				html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
			});
		}

		return c.json({ message: "アナウンスメントを作成しました", status: 201 });
	});

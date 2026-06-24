import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo/auth/server";
import {
	createReminder,
	deleteNotification,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "@lms-repo-edge-version/db/utils/mutation/notifications";
import {
	fetchNotifications,
	fetchNotificationsCount,
} from "@lms-repo-edge-version/db/utils/query/notifications";
import { resend } from "@lms-repo-edge-version/emails";
import { Hono } from "hono";
import { z } from "zod";

// 通知に関するロジック
export const notificationsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// 通知取得
	.get(
		"/",
		zValidator(
			"query",
			z.object({
				limit: z.coerce.number().int().positive().default(10),
				offset: z.coerce.number().int().nonnegative().default(0),
			}),
		),
		async (c) => {
			const { userId } = c.get("session");
			const { limit, offset } = c.req.valid("query");

			const notificationList = await fetchNotifications(
				userId,
				Number(limit),
				Number(offset),
			);
			return c.json(notificationList, 200);
		},
	)
	// 通知総数取得
	.get(
		"/count",
		zValidator(
			"query",
			z.object({ filter: z.enum(["all", "unread", "read"]).optional() }),
		),
		async (c) => {
			const { userId } = c.get("session");
			const { filter } = c.req.valid("query");
			const count = await fetchNotificationsCount(userId, filter);
			return c.json({ count }, 200);
		},
	)
	// 通知既読
	.patch(
		"/:id/mark_as_read",
		zValidator("param", z.object({ id: z.string() })),
		async (c) => {
			const id = c.req.param("id");
			const result = await markNotificationAsRead(id);
			return c.json(result);
		},
	)
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
	// リマインダーの作成（このエンドポイントはSchedulerによって定期実行される）
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

		return c.json({ message: "リマインダーを作成しました", status: 201 });
	});

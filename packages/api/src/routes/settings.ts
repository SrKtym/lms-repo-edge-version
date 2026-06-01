import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo/auth/server";
import type { EmailNotificationSettings } from "@lms-repo/db/types";
import { updateEmailNotificationSettings } from "@lms-repo/db/utils/mutation/settings";
import { fetchEmailNotificationSettings } from "@lms-repo/db/utils/query/settings";
import { Hono } from "hono";
import { z } from "zod";

export const settingsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// メール通知設定更新
	.post(
		"/email_notification",
		zValidator("json", z.custom<Omit<EmailNotificationSettings, "userId">>()),
		async (c) => {
			const { userId } = c.get("session");
			const settings = await updateEmailNotificationSettings({
				...c.req.valid("json"),
				userId,
			});
			return c.json(settings);
		},
	)
	// メール通知設定取得
	.get("/email_notification", async (c) => {
		const { userId } = c.get("session");
		const settings = await fetchEmailNotificationSettings(userId);
		return c.json(settings);
	});

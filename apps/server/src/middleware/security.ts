import { isSpoofedBot } from "@arcjet/inspect";
import { findIp } from "@arcjet/ip";
import type { Session } from "@lms-repo-edge-version/auth/server";
import { createMiddleware } from "hono/factory";
import { aj } from "../lib";

// APIに対するレート制限、ボット検出などを行うミドルウェア
export const securityMiddleware = createMiddleware<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>(async (c, next) => {
	let { userId } = c.get("session");

	// セッションがない場合はIPアドレスをユーザーIDとして使用
	if (!userId) {
		userId = findIp(c.req.raw) || "127.0.0.1";
	}

	const decision = await aj.protect(c.req.raw, { requested: 5, userId });

	if (decision.isDenied()) {
		// リクエスト拒否の理由がレート制限の場合
		if (decision.reason.isRateLimit()) {
			return c.json({ error: "Too Many Requests" }, 429);
		}
		// リクエスト拒否の理由がボット検出の場合
		if (decision.reason.isBot()) {
			return c.json({ error: "Bot Detected" }, 403);
		}
		// その他の理由の場合
		return c.json({ error: "Forbidden" }, 403);
	}

	if (decision.results.some(isSpoofedBot)) {
		return c.json({ error: "Forbidden" }, 403);
	}

	await next();
});

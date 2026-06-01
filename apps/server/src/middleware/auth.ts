import type { Session } from "@lms-repo-edge-version/auth/server";
import { createAuth } from "@lms-repo-edge-version/auth/server";
import { createMiddleware } from "hono/factory";

// 認証ミドルウェア
export const authMiddleware = createMiddleware<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>(async (c, next) => {
	const session = await createAuth().api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session) {
		return c.json({ message: "not authenticated" }, 401);
	}

	c.set("user", session.user);
	c.set("session", session.session);
	await next();
});

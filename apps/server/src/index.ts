import { fullRoutes } from "@lms-repo-edge-version/api";
import { createAuth } from "@lms-repo-edge-version/auth/server";
import { env } from "@lms-repo-edge-version/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { authMiddleware } from "./middleware/auth";
import { securityMiddleware } from "./middleware/security";

const app = new Hono()
	.use(
		"*",
		// グローバルミドルウェア
		logger(),
		cors({
			origin: env.CORS_ORIGIN,
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
		secureHeaders(),
	)
	// 認証ミドルウェア
	.on(["POST", "GET"], "/api/auth/*", (c) => createAuth().handler(c.req.raw))
	.use("*", authMiddleware)
	// レート制限、ボット対策
	.on(["POST", "PUT", "DELETE"], "*", securityMiddleware)
	// ルーティング
	.route("/", fullRoutes);

export default app;

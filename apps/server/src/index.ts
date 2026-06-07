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
	// クライアントからの/api/authへのリクエストに対する処理
	.on(["POST", "GET"], "/api/auth/*", (c) => createAuth().handler(c.req.raw))
	// 認証ミドルウェア
	.use("*", authMiddleware)
	// レート制限、ボット検出
	.use("*", async (c, next) => {
		const method = c.req.method;
		const path = c.req.path;

		// 非対象のメソッド
		const allowMethods = ["GET", "OPTIONS"];

		// 対象のパス（メール送信を伴う処理と署名付きURLを取得する処理）
		const appliedPaths = [
			"/api/announcements",
			"/api/assignments",
			"/api/notifications/reminder",
			"/api/submissions/signed_urls",
		];

		// レスポンス速度に影響するので、特定のメソッド、パスのみに適用
		if (
			!allowMethods.includes(method) &&
			appliedPaths.some((p) => path.startsWith(p))
		) {
			return securityMiddleware(c, next);
		}

		return next();
	})
	// ルーティング
	.route("/", fullRoutes);

export default app;

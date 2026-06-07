import { findIp } from "@arcjet/ip";
import type { Session } from "@lms-repo-edge-version/auth/server";
import { createMiddleware } from "hono/factory";
import { aj } from "../lib";

// HTTPメソッドごとのトークン消費量（リクエスト重み付け）
// トークンバケットのcapacity: 300、refillRate: 100/分
const RATE_LIMITS: Record<string, number> = {
	// GET: 3, // GETリクエスト: 3トークン消費（読み取りは軽量）
	// OPTIONS: 3, // OPTIONSリクエスト: 3トークン消費（プリフライト）
	POST: 15, // POSTリクエスト: 15トークン消費（データ作成）
	PUT: 15, // PUTリクエスト: 15トークン消費（データ更新）
	PATCH: 5, // PATCHリクエスト: 5トークン消費（部分更新）
	DELETE: 15, // DELETEリクエスト: 15トークン消費（データ削除）
};

// デフォルトのトークン消費量
const DEFAULT_RATE_LIMIT = 5;

// IPアドレスキャッシュ（パフォーマンス向上）
const ipCache = new Map<string, string>();
const IP_CACHE_TTL = 5 * 60 * 1000; // 5分

// キャッシュからIPアドレスを取得
function getCachedIp(req: Request): string {
	const cacheKey =
		req.headers.get("x-forwarded-for") ||
		req.headers.get("cf-connecting-ip") ||
		"unknown";
	const cached = ipCache.get(cacheKey);
	if (cached) {
		return cached;
	}
	const ip = findIp(req) || "127.0.0.1";
	ipCache.set(cacheKey, ip);
	// TTL後にキャッシュを削除
	setTimeout(() => ipCache.delete(cacheKey), IP_CACHE_TTL);
	return ip;
}

// APIに対するレート制限、ボット検出などを行うミドルウェア
export const securityMiddleware = createMiddleware<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>(async (c, next) => {
	const session = c.get("session");
	const userId = session?.userId || getCachedIp(c.req.raw);
	const method = c.req.method;

	const requested = RATE_LIMITS[method] || DEFAULT_RATE_LIMIT;

	const decision = await aj.protect(c.req.raw, { requested, userId });

	if (decision.isDenied()) {
		// リクエスト拒否の理由がレート制限の場合
		if (decision.reason.isRateLimit()) {
			return c.json({ error: "Too Many Requests" }, 429);
		}
		// リクエスト拒否の理由がボット検出の場合
		// if (decision.reason.isBot()) {
		// 	return c.json({ error: "Bot Detected" }, 403);
		// }
		// その他の理由の場合
		return c.json({ error: "Forbidden" }, 403);
	}

	// if (decision.results.some(isSpoofedBot)) {
	// 	return c.json({ error: "Forbidden" }, 403);
	// }

	return next();
});

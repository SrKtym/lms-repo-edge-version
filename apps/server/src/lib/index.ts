import arcjet, { tokenBucket } from "@arcjet/node";
import { env } from "@lms-repo-edge-version/env/server";

export const aj = arcjet({
	key: env.ARCJET_KEY,
	characteristics: ["userId"],
	rules: [
		// ボット検出のルール
		// detectBot({
		// 	mode: "LIVE",
		// 	allow: [
		// 		"CATEGORY:SEARCH_ENGINE", // Googlebot, Bingbot など
		// 		"CATEGORY:MONITOR", // UptimeRobot などの死活監視ツール
		// 		"CATEGORY:PREVIEW", // Slack, Discord, X (旧Twitter) などのリンクプレビュー
		// 	],
		// }),
		// レート制限のアルゴリズムとしてトークンバケットを採用
		tokenBucket({
			mode: "LIVE",
			refillRate: 100, // 100個のトークンを補充
			interval: 60, // 1分ごとに
			capacity: 300, // バケットには最大300個のトークンが含まれる
		}),
	],
});

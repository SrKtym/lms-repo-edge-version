import alchemy from "alchemy";
import { R2Bucket, Vite, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

// 開発環境の場合のみローカルの.envファイルを読み込む
// 本番環境ではAlchemyの環境変数管理を使用
const env = process.env.NODE_ENV || "development";
config({ path: "./.env" });
config({ path: `../../apps/web/.env.${env}`, override: true });
config({ path: `../../apps/server/.env.${env}`, override: true });

const app = await alchemy("lms-repo-edge-version");

export const storageBucket = await R2Bucket("storage");

export const web = await Vite("web", {
	cwd: "../../apps/web",
	assets: "dist",
	bindings: {
		VITE_SERVER_URL: alchemy.env.VITE_SERVER_URL!,
		VITE_CLIENT_URL: alchemy.env.VITE_CLIENT_URL!,
	},
});

export const server = await Worker("server", {
	cwd: "../../apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	bindings: {
		DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
		BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
		BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
		RESEND_API_KEY: alchemy.secret.env.RESEND_API_KEY!,
		ARCJET_KEY: alchemy.secret.env.ARCJET_KEY!,
		GITHUB_CLIENT_ID: alchemy.secret.env.GITHUB_CLIENT_ID!,
		GITHUB_CLIENT_SECRET: alchemy.secret.env.GITHUB_CLIENT_SECRET!,
		GOOGLE_CLIENT_ID: alchemy.secret.env.GOOGLE_CLIENT_ID!,
		GOOGLE_CLIENT_SECRET: alchemy.secret.env.GOOGLE_CLIENT_SECRET!,
		TWITTER_CLIENT_ID: alchemy.secret.env.TWITTER_CLIENT_ID!,
		TWITTER_CLIENT_SECRET: alchemy.secret.env.TWITTER_CLIENT_SECRET!,
		STORAGE_BUCKET: storageBucket,
		R2_ACCESS_KEY_ID: alchemy.secret.env.R2_ACCESS_KEY_ID!,
		R2_SECRET_ACCESS_KEY: alchemy.secret.env.R2_SECRET_ACCESS_KEY!,
		R2_ACCOUNT_ID: alchemy.env.R2_ACCOUNT_ID!,
	},
	dev: {
		port: 3000,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();

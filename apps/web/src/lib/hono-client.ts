import type { FullRoutes } from "@lms-repo-edge-version/api";
import { env } from "@lms-repo-edge-version/env/web";
import { hc } from "hono/client";

export const client = hc<FullRoutes>(env.VITE_SERVER_URL, {
	init: {
		credentials: "include",
	},
});

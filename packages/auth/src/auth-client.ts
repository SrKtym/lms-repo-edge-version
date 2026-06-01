import { passkeyClient } from "@better-auth/passkey/client";
import { env } from "@lms-repo-edge-version/env/web";
import { adminClient, twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.VITE_SERVER_URL,
	plugins: [passkeyClient(), adminClient(), twoFactorClient()],
});

type User = typeof authClient.$Infer.Session.user;
export type UserData = Pick<User, "email" | "name" | "image">;

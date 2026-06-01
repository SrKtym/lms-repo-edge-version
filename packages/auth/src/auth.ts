import { passkey } from "@better-auth/passkey";
import { createDb } from "@lms-repo-edge-version/db";
import * as schema from "@lms-repo-edge-version/db/schema/auth";
import { resend } from "@lms-repo-edge-version/emails";
import ConfirmSignUpEmail from "@lms-repo-edge-version/emails/components/confirm-sign-up-email";
import DeleteAccountEmail from "@lms-repo-edge-version/emails/components/delete-account-email";
import OtpNotificationEmail from "@lms-repo-edge-version/emails/components/otp-notification-email";
import ResetPasswordEmail from "@lms-repo-edge-version/emails/components/reset-password-email";
import { env } from "@lms-repo-edge-version/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, twoFactor } from "better-auth/plugins";

export function createAuth() {
	const db = createDb();
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
			autoSignIn: true,
			requireEmailVerification: true,
			resetPasswordTokenExpiresIn: 3600, // 1 hour
			async sendResetPassword({ user, url }) {
				await resend.emails.send({
					from: "onboarding@resend.dev",
					to: user.email,
					subject: "パスワードの変更",
					react: ResetPasswordEmail({
						email: user.email,
						url,
					}),
				});
			},
		},
		emailVerification: {
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			expiresIn: 3600, // 1 hour
			async sendVerificationEmail({ user, url }) {
				const redirectUrl = new URL(url);
				redirectUrl.searchParams.set(
					"callbackURL",
					`${env.CORS_ORIGIN}/set-twofactor`,
				);
				await resend.emails.send({
					from: "onboarding@resend.dev",
					to: user.email,
					subject: "新規ログインの確認",
					react: ConfirmSignUpEmail({
						email: user.email,
						url: redirectUrl.toString(),
					}),
				});
			},
		},
		user: {
			deleteUser: {
				enabled: true,
				async sendDeleteAccountVerification({ user, url }) {
					await resend.emails.send({
						from: "onboarding@resend.dev",
						to: user.email,
						subject: "アカウント削除の確認",
						react: DeleteAccountEmail({
							email: user.email,
							url,
						}),
					});
				},
			},
		},
		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ["google", "github", "twitter"],
			},
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		plugins: [
			admin({
				defaultRole: "student",
			}),
			twoFactor({
				enabled: true,
				otpOptions: {
					async sendOTP({ user, otp }) {
						await resend.emails.send({
							from: "onboarding@resend.dev",
							to: user.email,
							subject: "OTP認証",
							react: OtpNotificationEmail({
								email: user.email,
								otpCode: otp,
							}),
						});
					},
				},
				skipVerificationOnEnable: true,
			}),
			passkey(),
		],
		socialProviders: {
			github: {
				clientId: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
			},
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
			twitter: {
				clientId: env.TWITTER_CLIENT_ID,
				clientSecret: env.TWITTER_CLIENT_SECRET,
			},
		},
	});
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];

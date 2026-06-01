import { authClient } from "@lms-repo-edge-version/auth/web";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SocialLoginField } from "@/components/_auth/social-login-field";

export const Route = createFileRoute("/_auth/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	const [error, setError] = useState<string>("");
	const navigate = useNavigate({
		from: "/",
	});

	const handlePasskeySignIn = async () => {
		await authClient.signIn.passkey({
			fetchOptions: {
				onSuccess: () => {
					navigate({
						to: "/dashboard",
					});
				},
				onError: () => {
					setError("パスキー認証に失敗しました");
				},
			},
		});
	};

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				setError("");

				await authClient.signIn.email(
					{
						email: value.email,
						password: value.password,
					},
					{
						onSuccess: async (ctx) => {
							if (ctx.data.twoFactorRedirect) {
								navigate({
									to: "/verify-otp",
								});
								return;
							}
							navigate({
								to: "/dashboard",
							});
						},
						onError: () => {
							setError("メールアドレスまたはパスワードが正しくありません");
						},
					},
				);
			} catch {
				setError(
					"予期しないエラーが発生しました。お手数ですが再度試行してください。",
				);
			}
		},
		validators: {
			onSubmit: z.object({
				email: z.email("無効なメールアドレスです"),
				password: z.string().min(8, "パスワードは8文字以上で入力してください"),
			}),
		},
	});

	return (
		<div className="form-container">
			<h1 className="form-header">サインイン</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="form-field"
				aria-describedby="sign-in-error"
			>
				<form.Field name="email">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									type: "email",
									value: field.state.value,
									"aria-describedby": "email-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
								}}
								labelProps={{
									htmlFor: field.name,
									children: "メールアドレス",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="email-error"
									key={error?.message}
									className="text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									type: "password",
									value: field.state.value,
									minLength: 8,
									"aria-describedby": "password-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
								}}
								labelProps={{
									htmlFor: field.name,
									children: "パスワード",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="password-error"
									key={error?.message}
									className="text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				{/* エラーメッセージ */}
				{error && (
					<div
						id="sign-in-error"
						className="rounded-md bg-red-50 p-3 dark:bg-red-900/20"
					>
						<p className="text-red-600 text-sm dark:text-red-400">{error}</p>
					</div>
				)}

				<SocialLoginField onPasskeySignIn={handlePasskeySignIn} />

				<form.Subscribe>
					{({ canSubmit, isSubmitting }) => (
						<DefaultButton
							type="submit"
							className="w-full"
							isDisabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "処理中..." : "サインイン"}
						</DefaultButton>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 flex flex-col items-center gap-2 text-center">
				<Link to="/sign-up" className="default-link">
					アカウントをお持ちでない方
				</Link>
				<Link to="/request-reset-password" className="default-link">
					パスワードをお忘れの方
				</Link>
			</div>
		</div>
	);
}

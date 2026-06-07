import { authClient } from "@lms-repo-edge-version/auth/web";
import { Check } from "@lms-repo-edge-version/ui/assets/icons/check";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SocialLoginField } from "@/components/_auth/social-login-field";

export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "サインアップ | LMS-repo",
			},
		],
	}),
});

function RouteComponent() {
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState({
		isSuccess: false,
		email: "",
	});

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await authClient.signUp.email(
					{
						email: value.email,
						password: value.password,
						name: value.name,
					},
					{
						onSuccess: () => {
							setSuccess({
								isSuccess: true,
								email: value.email,
							});
						},
						onError: ({ response }) => {
							switch (response.status) {
								case 429:
									setError(
										"サインアップ試行回数が多すぎます。しばらくしてからもう一度お試しください。",
									);
									break;
								default:
									setError("メールアドレスまたはパスワードが正しくありません");
							}
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
				name: z.string().min(1, "名前は1文字以上である必要があります"),
				email: z.email("有効なメールアドレスを入力してください"),
				password: z
					.string()
					.min(8, "パスワードは8文字以上である必要があります"),
			}),
		},
	});

	return (
		<div className="form-container">
			<h1 className="form-header">サインアップ</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="form-field"
				aria-describedby="sign-up-messages"
			>
				<form.Field name="name">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									value: field.state.value,
									placeholder: "例: 山田太郎",
									"aria-describedby": "name-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
								}}
								labelProps={{
									htmlFor: field.name,
									children: "ユーザー名",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="name-error"
									key={error?.message}
									className="text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="email">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									type: "email",
									value: field.state.value,
									placeholder: "例: example@example.com",
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
									placeholder: "例: password123",
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
					<div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
						<p
							id="sign-up-messages"
							className="text-red-600 text-sm dark:text-red-400"
						>
							{error}
						</p>
					</div>
				)}

				{/* 成功メッセージ */}
				{success.isSuccess && (
					<div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
						<div className="flex items-center gap-2">
							<Check
								width={32}
								height={32}
								className="text-green-600 dark:text-green-400"
							/>
							<p
								id="sign-up-messages"
								className="text-green-600 text-sm dark:text-green-400"
							>
								登録を受け付けました。アカウント作成可能な場合は
								{success.email} へ確認メールを送信します。
							</p>
						</div>
					</div>
				)}

				<SocialLoginField />

				<form.Subscribe>
					{({ canSubmit, isSubmitting }) => (
						<DefaultButton
							type="submit"
							className="w-full"
							isDisabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "処理中..." : "サインアップ"}
						</DefaultButton>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 text-center">
				<Link to="/sign-in" className="default-link">
					アカウントをお持ちの方
				</Link>
			</div>
		</div>
	);
}

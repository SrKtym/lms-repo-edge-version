import { authClient } from "@lms-repo-edge-version/auth/web";
import { env } from "@lms-repo-edge-version/env/web";
import { Check } from "@lms-repo-edge-version/ui/assets/icons/check";
import { ResetPasswordIcon } from "@lms-repo-edge-version/ui/assets/icons/reset-password";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/_auth/request-reset-password")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "パスワードリセットの申請 | LMS-repo",
			},
		],
	}),
});

function RouteComponent() {
	const [error, setError] = useState<string>("");
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			try {
				setError("");
				setIsSuccess(false);

				await authClient.requestPasswordReset(
					{
						email: value.email,
						redirectTo: `${env.VITE_CLIENT_URL}/reset-password`,
					},
					{
						onError: ({ response }) => {
							switch (response.status) {
								case 429:
									setError(
										"リセットメールの送信試行回数が多すぎます。しばらくしてからもう一度お試しください。",
									);
									break;
								default:
									setError("リセットメールの送信に失敗しました");
							}
						},
					},
				);

				setIsSuccess(true);
			} catch {
				setError(
					"予期しないエラーが発生しました。お手数ですが再度試行してください。",
				);
			}
		},
		validators: {
			onSubmit: z.object({
				email: z.email("有効なメールアドレスを入力してください"),
			}),
		},
	});

	return (
		<div className="w-full space-y-6">
			{/* Header Section */}
			<div className="text-center">
				<div className="mb-6 flex justify-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
						<ResetPasswordIcon
							className="text-orange-600 dark:text-orange-400"
							width={32}
							height={32}
						/>
					</div>
				</div>
				<h3 className="mb-3 font-bold text-2xl text-gray-900 dark:text-gray-100">
					パスワードリセットの申請
				</h3>
				<p className="text-gray-600 dark:text-gray-400">
					メールアドレスを入力することで、パスワードをリセットするためのメールが送信されます。
				</p>
			</div>

			{/* Form */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
				aria-describedby="request-reset-password-messages"
			>
				<form.Field name="email">
					{(field) => (
						<div className="space-y-3">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									type: "email",
									value: field.state.value,
									"aria-describedby": "email-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "メールアドレスを入力してください",
									className: "w-full",
								}}
								labelProps={{
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

				{/* エラーメッセージ */}
				{error && (
					<div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
						<p
							id="request-reset-password-messages"
							className="text-red-600 text-sm dark:text-red-400"
						>
							{error}
						</p>
					</div>
				)}

				{/* 成功メッセージ */}
				{isSuccess && (
					<div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
						<div className="flex items-center gap-3">
							<Check className="text-green-600 dark:text-green-400" />
							<div id="request-reset-password-messages">
								<h4 className="font-medium text-green-800 dark:text-green-200">
									リセットメールを送信しました
								</h4>
								<p className="text-green-600 text-sm dark:text-green-400">
									メールアドレスを確認してください
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Submit Button */}
				<form.Subscribe
					selector={(state) => ({
						canSubmit: state.canSubmit,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<DefaultButton
							type="submit"
							className="w-full"
							isDisabled={!canSubmit || isSubmitting || isSuccess}
						>
							{isSubmitting ? "送信中..." : "リセットリンクを送信"}
						</DefaultButton>
					)}
				</form.Subscribe>
			</form>

			{/* Success State - Additional Info */}
			{isSuccess && (
				<div className="text-center">
					<p className="text-gray-500 text-sm dark:text-gray-400">
						メールが届かない場合は、スパムフォルダを確認するか、もう一度お試しください
					</p>
				</div>
			)}

			{/* Back to Sign In */}
			<div className="text-center">
				<Link to="/sign-in" className="default-link">
					サインインに戻る
				</Link>
			</div>
		</div>
	);
}

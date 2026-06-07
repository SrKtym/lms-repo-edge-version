import { authClient } from "@lms-repo-edge-version/auth/web";
import { Check } from "@lms-repo-edge-version/ui/assets/icons/check";
import { ResetPasswordIcon } from "@lms-repo-edge-version/ui/assets/icons/reset-password";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export default function ResetPassword({ token }: { token: string }) {
	const [error, setError] = useState<string>("");
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			try {
				setError("");
				setIsSuccess(false);

				await authClient.resetPassword(
					{
						token: token,
						newPassword: value.password,
					},
					{
						onError: ({ response }) => {
							switch (response.status) {
								case 429:
									setError(
										"パスワードのリセット試行回数が多すぎます。しばらくしてからもう一度お試しください。",
									);
									break;
								default:
									setError("パスワードのリセットに失敗しました");
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
			onSubmit: z
				.object({
					password: z
						.string()
						.min(8, "パスワードは8文字以上である必要があります"),
					confirmPassword: z
						.string()
						.min(8, "パスワードは8文字以上である必要があります"),
				})
				.refine((data) => data.password === data.confirmPassword, {
					path: ["confirmPassword"],
					message: "パスワードが一致しません",
				}),
		},
	});

	return (
		<div className="w-full space-y-6">
			{/* Header Section */}
			<div className="text-center">
				<div className="mb-6 flex justify-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
						<ResetPasswordIcon
							className="text-purple-600 dark:text-purple-400"
							width={32}
							height={32}
						/>
					</div>
				</div>
				<h3 className="mb-3 font-bold text-2xl text-gray-900 dark:text-gray-100">
					パスワードをリセット
				</h3>
				<p className="text-gray-600 dark:text-gray-400">
					新しいパスワードを入力し、確認してリセットを完了してください
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
				aria-describedby="reset-password-messages"
			>
				<form.Field
					name="password"
					children={(field) => (
						<div className="space-y-3">
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
									placeholder: "新しいパスワードを入力",
									className: "w-full",
								}}
								labelProps={{
									htmlFor: field.name,
									children: "新しいパスワード",
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
				/>

				<form.Field
					name="confirmPassword"
					children={(field) => (
						<div className="space-y-3">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									type: "password",
									value: field.state.value,
									minLength: 8,
									"aria-describedby": "confirm-password-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "新しいパスワードを再入力",
									className: "w-full",
								}}
								labelProps={{
									htmlFor: field.name,
									children: "パスワードの確認",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="confirm-password-error"
									key={error?.message}
									className="text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				/>

				{/* エラーメッセージ */}
				{error && (
					<div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
						<p
							id="reset-password-messages"
							className="text-red-600 dark:text-red-400"
						>
							{error}
						</p>
					</div>
				)}

				{/* 成功メッセージ */}
				{isSuccess && (
					<div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
						<div className="flex items-center gap-2">
							<Check
								width={32}
								height={32}
								className="text-green-600 dark:text-green-400"
							/>
							<div id="reset-password-messages">
								<h4 className="font-medium text-green-800 dark:text-green-200">
									パスワードのリセットに成功しました。
								</h4>
								<p className="text-green-600 dark:text-green-400">
									パスワードが正常にリセットされました。新しいパスワードでサインインできます。
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Submit Button */}
				<form.Subscribe>
					{({ canSubmit, isSubmitting }) => (
						<DefaultButton
							type="submit"
							className="w-full"
							isDisabled={!canSubmit || isSubmitting || isSuccess}
						>
							{isSubmitting ? "送信中..." : "パスワードをリセット"}
						</DefaultButton>
					)}
				</form.Subscribe>
			</form>

			{/* Back to Sign In */}
			<div className="text-center">
				<Link
					to="/sign-in"
					className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
				>
					サインインに戻る
				</Link>
			</div>
		</div>
	);
}

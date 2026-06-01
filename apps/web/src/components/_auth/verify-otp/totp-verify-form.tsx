import { authClient } from "@lms-repo-edge-version/auth/web";
import { Lock } from "@lms-repo-edge-version/ui/assets/icons/lock";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputOTPFor2fa } from "@lms-repo-edge-version/ui/components/input-otp";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";

export default function TotpVerifyForm({
	onSuccess,
}: {
	onSuccess: () => void;
}) {
	const [error, setError] = useState<string>("");

	const form = useForm({
		defaultValues: {
			totpCode: "",
		},
		onSubmit: async ({ value }) => {
			try {
				setError("");

				await authClient.twoFactor.verifyTotp(
					{
						code: value.totpCode,
					},
					{
						onSuccess: () => {
							onSuccess();
						},
						onError: () => {
							setError(
								"認証コードが正しくありません。もう一度お試しください。",
							);
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
				totpCode: z.string().length(6, "認証コードは6桁で入力してください"),
			}),
		},
	});

	return (
		<div className="flex w-full flex-col items-center space-y-6">
			{/* ヘッダー情報 */}
			<div className="text-center">
				<div className="mb-4 flex justify-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
						<Lock className="text-blue-600 dark:text-blue-400" />
					</div>
				</div>
				<h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
					認証アプリのコード
				</h3>
				<p className="text-gray-600 text-sm dark:text-gray-400">
					Google
					Authenticatorや他の認証アプリに表示されている6桁のコードを入力してください
				</p>
			</div>

			{/* フォーム */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="form-field flex flex-col items-center"
				aria-describedby="totp-verify-error"
			>
				<form.Field name="totpCode">
					{(field) => (
						<div className="space-y-3">
							<InputOTPFor2fa
								name={field.name}
								value={field.state.value}
								onChange={(value) => {
									field.handleChange(value);
									setError(""); // 入力時にエラーをクリア
								}}
								ariaDescribedby="totpCode-error"
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="totpCode-error"
									key={error?.message}
									className="text-red-500 text-sm"
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
							id="totp-verify-error"
							className="text-red-600 text-sm dark:text-red-400"
						>
							{error}
						</p>
					</div>
				)}

				<form.Subscribe>
					{({ canSubmit, isSubmitting }) => (
						<DefaultButton
							type="submit"
							className="w-full"
							isDisabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "認証中..." : "認証コードを確認"}
						</DefaultButton>
					)}
				</form.Subscribe>
			</form>

			{/* ヘルプセクション */}
			<div className="text-center">
				<p className="text-gray-500 text-xs dark:text-gray-400">
					コードが表示されない場合は、認証アプリの時刻を同期してください
				</p>
			</div>
		</div>
	);
}

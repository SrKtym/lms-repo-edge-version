import { authClient } from "@lms-repo-edge-version/auth/web";
import { Email } from "@lms-repo-edge-version/ui/assets/icons/email";
import {
	DefaultButton,
	OutlineButton,
} from "@lms-repo-edge-version/ui/components/button";
import { InputOTPFor2fa } from "@lms-repo-edge-version/ui/components/input-otp";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";

export default function OtpVerifyForm({
	onSuccess,
}: {
	onSuccess: () => void;
}) {
	const [error, setError] = useState<string>("");
	const [otpSent, setOtpSent] = useState(false);
	const [resendTimer, setResendTimer] = useState(0);

	const verifyForm = useForm({
		defaultValues: {
			otpCode: "",
		},
		onSubmit: async ({ value }) => {
			try {
				setError("");

				await authClient.twoFactor.verifyOtp(
					{
						code: value.otpCode,
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
				otpCode: z.string().length(6, "認証コードは6桁で入力してください"),
			}),
		},
	});

	const sendOtpForm = useForm({
		onSubmit: async () => {
			try {
				setError("");
				await authClient.twoFactor.sendOtp({
					fetchOptions: {
						onSuccess: () => {
							setOtpSent(true);
							startResendTimer();
						},
						onError: (ctx) => {
							switch (ctx.error.status) {
								case 401:
									setError(
										"メールの送信に失敗しました。お手数ですがサインインページへ戻って再試行してください。",
									);
									break;
								default:
									setError(
										"メールの送信に失敗しました。もう一度お試しください。",
									);
							}
						},
					},
				});
			} catch {
				setError(
					"予期しないエラーが発生しました。お手数ですが再度試行してください。",
				);
			}
		},
	});

	// メール再送信までのカウントダウン
	const startResendTimer = () => {
		setResendTimer(60);
		const timer = setInterval(() => {
			setResendTimer((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	// メール再送信
	const handleResendOtp = () => {
		if (resendTimer === 0) {
			sendOtpForm.handleSubmit();
		}
	};

	return (
		<div className="flex w-full flex-col items-center space-y-6">
			{/* ヘッダー情報 */}
			<div className="text-center">
				<div className="mb-4 flex justify-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
						<Email className="text-green-600 dark:text-green-400" />
					</div>
				</div>
				<h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
					SMS/メール認証
				</h3>
				<p className="text-gray-600 text-sm dark:text-gray-400">
					登録済みの電話番号またはメールアドレスに送信された6桁のコードを入力してください
				</p>
			</div>

			{/* OTP送信フォーム */}
			{!otpSent ? (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						sendOtpForm.handleSubmit();
					}}
					className="form-field"
					aria-describedby="sendOtp-error"
				>
					{/* エラーメッセージ */}
					{error && (
						<div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
							<p
								id="sendOtp-error"
								className="text-red-600 text-sm dark:text-red-400"
							>
								{error}
							</p>
						</div>
					)}

					<sendOtpForm.Subscribe>
						{({ canSubmit, isSubmitting }) => (
							<OutlineButton
								type="submit"
								isDisabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "送信中..." : "認証コードを送信"}
							</OutlineButton>
						)}
					</sendOtpForm.Subscribe>
				</form>
			) : (
				/* OTP検証フォーム */
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						verifyForm.handleSubmit();
					}}
					className="form-field flex flex-col items-center"
					aria-describedby="otp-verify-error"
				>
					<verifyForm.Field name="otpCode">
						{(field) => (
							<div className="space-y-3">
								<InputOTPFor2fa
									name={field.name}
									value={field.state.value}
									onChange={(value) => {
										field.handleChange(value);
										setError(""); // 入力時にエラーをクリア
									}}
									ariaDescribedby="otpCode-error"
								/>
								{field.state.meta.errors.map((error) => (
									<p
										id="otpCode-error"
										key={error?.message}
										className="text-red-500 text-sm"
									>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</verifyForm.Field>

					{/* エラーメッセージ */}
					{error && (
						<div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
							<p
								id="otp-verify-error"
								className="text-red-600 text-sm dark:text-red-400"
							>
								{error}
							</p>
						</div>
					)}

					<verifyForm.Subscribe>
						{({ canSubmit, isSubmitting }) => (
							<DefaultButton
								type="submit"
								className="w-full"
								isDisabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "認証中..." : "認証コードを確認"}
							</DefaultButton>
						)}
					</verifyForm.Subscribe>

					{/* 再送信ボタン */}
					<div className="text-center">
						<OutlineButton
							onPress={handleResendOtp}
							isDisabled={resendTimer > 0}
						>
							{resendTimer > 0
								? `再送信可能まで ${resendTimer} 秒`
								: "認証コードを再送信"}
						</OutlineButton>
					</div>
				</form>
			)}

			{/* ヘルプセクション */}
			<div className="text-center">
				<p className="text-gray-500 text-xs dark:text-gray-400">
					コードが届かない場合は、迷惑メールフォルダもご確認ください
				</p>
			</div>
		</div>
	);
}

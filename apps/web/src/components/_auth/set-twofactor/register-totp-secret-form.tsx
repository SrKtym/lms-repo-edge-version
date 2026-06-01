import { authClient } from "@lms-repo-edge-version/auth/web";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { InputOTPFor2fa } from "@lms-repo-edge-version/ui/components/input-otp";
import { QRCodeComponent } from "@lms-repo-edge-version/ui/components/qr-code";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export function RegisterTotpSecretForm({ totpURI }: { totpURI: string }) {
	const navigate = useNavigate({
		from: "/",
	});
	const [error, setError] = useState<string>("");
	const form = useForm({
		defaultValues: {
			totpCode: "",
		},
		onSubmit: ({ value }) => {
			try {
				handleRegisterTotpSecret(value.totpCode);
			} catch {
				setError(
					"予期しないエラーが発生しました。お手数ですが再度試行してください。",
				);
			}
		},
		validators: {
			onSubmit: z.object({
				totpCode: z.string().length(6, "コードは6桁の数字である必要があります"),
			}),
		},
	});

	// TOTPシークレットキーの登録
	const handleRegisterTotpSecret = async (code: string) => {
		await authClient.twoFactor.verifyTotp(
			{ code },
			{
				onSuccess: () =>
					navigate({
						to: "/add-passkey",
					}),
				onError: () => {
					setError("認証コードが正しくありません。もう一度お試しください。");
				},
			},
		);
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<p>
				以下のQRコードを認証アプリで読み取り、表示されているセキュリティコードを入力してください。
			</p>
			<QRCodeComponent value={totpURI} />
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="form-field flex flex-col items-center"
				aria-describedby="2fa-setting-error"
			>
				<form.Field name="totpCode">
					{(field) => (
						<div className="space-y-2">
							<InputOTPFor2fa
								name={field.name}
								value={field.state.value}
								onChange={field.handleChange}
								ariaDescribedby="totpCode-error"
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="totpCode-error"
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
							id="2fa-setting-error"
							className="text-red-600 text-sm dark:text-red-400"
						>
							{error}
						</p>
					</div>
				)}

				<div className="flex justify-end gap-2">
					<CancelButton slot="close">キャンセル</CancelButton>
					<form.Subscribe>
						{({ canSubmit, isSubmitting }) => (
							<DefaultButton
								type="submit"
								isDisabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "処理中..." : "作成"}
							</DefaultButton>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}

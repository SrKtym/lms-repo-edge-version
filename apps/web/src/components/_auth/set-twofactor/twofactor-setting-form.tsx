import { authClient } from "@lms-repo-edge-version/auth/web";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export function TwoFactorSettingForm({
	selected,
	setTotpURI,
}: {
	selected: string;
	setTotpURI: (totpURI: string) => void;
}) {
	const navigate = useNavigate({
		from: "/",
	});
	const form = useForm({
		defaultValues: {
			password: "",
		},
		onSubmit: ({ value }) => {
			try {
				handleSetTwofactor(value.password);
			} catch (error) {
				console.error(error);
			}
		},
		validators: {
			onSubmit: z.object({
				password: z.string().min(8, "パスワードは8文字以上で入力してください"),
			}),
		},
	});

	const [error, setError] = useState<string>("");

	// 2要素認証の有効化
	const handleValidTwofactor = async (password: string) => {
		const { data } = await authClient.twoFactor.enable({ password });
		if (data) {
			setTotpURI(data.totpURI);
		} else {
			setError("2要素認証の有効化に失敗しました");
		}
	};

	// 2要素認証の無効化
	const handleInvalidTwofactor = async (password: string) => {
		const { error } = await authClient.twoFactor.disable({ password });
		if (error) {
			setError("2要素認証の無効化に失敗しました");
		} else {
			navigate({
				to: "/add-passkey",
			});
		}
	};

	const handleSetTwofactor = (password: string) => {
		if (selected === "valid") handleValidTwofactor(password);
		else if (selected === "invalid") handleInvalidTwofactor(password);
		else return;
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="form-field p-1"
			aria-describedby="2fa-setting-error"
		>
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
					id="2fa-setting-error"
					className="rounded-md bg-red-50 p-3 dark:bg-red-900/20"
				>
					<p className="text-red-600 text-sm dark:text-red-400">{error}</p>
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
							{isSubmitting ? "処理中..." : "確認"}
						</DefaultButton>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}

import { authClient } from "@lms-repo-edge-version/auth/web";
import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import { Check } from "@lms-repo-edge-version/ui/assets/icons/check";
import { DangerIcon } from "@lms-repo-edge-version/ui/assets/icons/danger";
import { PasskeyLogo } from "@lms-repo-edge-version/ui/assets/icons/passkey-logo";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_auth/add-passkey")({
	component: RouteComponent,
	beforeLoad: async () => {
		// セッションデータをキャッシュまたは取得
		const session = await queryClient.ensureQueryData({
			queryKey: ["session"],
			queryFn: async () => {
				const res = await authClient.getSession();
				return res;
			},
		});

		if (!session.data) {
			redirect({
				to: "/sign-in",
				throw: true,
			});
		}
	},
});

function RouteComponent() {
	const [isRegistering, setIsRegistering] = useState(false);
	const [error, setError] = useState<string>("");
	const [isSuccess, setIsSuccess] = useState(false);

	const handleAddPasskey = async () => {
		try {
			setIsRegistering(true);
			setError("");
			setIsSuccess(false);

			const { error } = await authClient.passkey.addPasskey();

			if (error) {
				setError(
					"パスキーの登録に失敗しました。お手数ですが再度試行してください。",
				);
			} else {
				setIsSuccess(true);
			}
		} catch {
			setError(
				"予期しないエラーが発生しました。お手数ですが再度試行してください。",
			);
		} finally {
			setIsRegistering(false);
		}
	};

	return (
		<div className="mx-auto max-w-md space-y-8">
			{/* Header Section */}
			<div className="text-center">
				<div className="mb-6 flex justify-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
						<PasskeyLogo />
					</div>
				</div>
				<h1 className="mb-3 font-bold text-2xl text-gray-900 dark:text-gray-100">
					パスキー登録
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					パスワードレス認証でセキュリティを強化しましょう
				</p>
			</div>

			{/* Main Card */}
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
				{/* Success Message */}
				{isSuccess && (
					<div className="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
						<div className="flex items-center gap-3">
							<Check className="text-green-600 dark:text-green-400" />
							<div>
								<h3 className="font-medium text-green-800 dark:text-green-200">
									登録が成功しました
								</h3>
								<p className="text-green-600 text-sm dark:text-green-400">
									パスキーが正常に登録されました。これで、安全なログインに使用できます。
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
						<div className="flex items-center gap-3">
							<DangerIcon width={32} height={32} />
							<div>
								<h3 className="font-medium text-red-800 dark:text-red-200">
									登録に失敗しました
								</h3>
								<p className="text-red-600 text-sm dark:text-red-400">
									{error}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Information Section */}
				{!isSuccess && (
					<div className="mb-6 space-y-4">
						<div className="flex items-start space-x-3">
							<div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
								<Check
									width={14}
									height={14}
									className="text-blue-600 dark:text-blue-400"
								/>
							</div>
							<div className="flex-1">
								<p className="text-gray-700 text-sm dark:text-gray-300">
									<span className="font-medium">パスワードレスログイン:</span>{" "}
									パスワードではなく、パスキーを使用して安全に認証します
								</p>
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
								<Check
									width={14}
									height={14}
									className="text-green-600 dark:text-green-400"
								/>
							</div>
							<div className="flex-1">
								<p className="text-gray-700 text-sm dark:text-gray-300">
									<span className="font-medium">生体認証:</span>
									パスワードではなく、指紋や顔認証、デバイスのPINを使用して認証します
								</p>
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
								<Check
									width={14}
									height={14}
									className="text-purple-600 dark:text-purple-400"
								/>
							</div>
							<div className="flex-1">
								<p className="text-gray-700 text-sm dark:text-gray-300">
									<span className="font-medium">クイックアクセス:</span>
									パスワードを覚える必要なく、ワンタップでログインできます
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				{!isSuccess ? (
					<div className="space-y-3">
						<DefaultButton
							className="w-full"
							onPress={handleAddPasskey}
							isDisabled={isRegistering}
						>
							{isRegistering ? "登録中..." : "パスキーを登録"}
						</DefaultButton>
						<Link to="/dashboard">
							<CancelButton className="w-full" isDisabled={isRegistering}>
								今はしない
							</CancelButton>
						</Link>
					</div>
				) : (
					<Link to="/dashboard">
						<DefaultButton className="w-full">
							ダッシュボードへ移動
							<ArrowRight />
						</DefaultButton>
					</Link>
				)}
			</div>

			{/* Footer Help Text */}
			<div className="text-center">
				<p className="text-gray-500 text-xs dark:text-gray-400">
					アカウント設定から、後からでもパスキーを登録できます
				</p>
			</div>
		</div>
	);
}

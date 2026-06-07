import { ArrowLeft } from "@lms-repo-edge-version/ui/assets/icons/arrow-left";
import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import { DangerIcon } from "@lms-repo-edge-version/ui/assets/icons/danger";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import ResetPassword from "@/components/_auth/reset-password/reset-password";

const searchSchema = z.object({
	token: z.string().optional(),
});

export const Route = createFileRoute("/_auth/reset-password")({
	component: RouteComponent,
	validateSearch: searchSchema,
	head: () => ({
		meta: [
			{
				title: "パスワードのリセット | LMS-repo",
			},
		],
	}),
});

function RouteComponent() {
	const { token } = Route.useSearch();

	if (!token) {
		return (
			<div className="w-full max-w-md space-y-8">
				{/* Header Section */}
				<div className="text-center">
					<div className="mb-6 flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
							<DangerIcon width={32} height={32} />
						</div>
					</div>
					<h3 className="mb-3 font-bold text-2xl text-gray-900 dark:text-gray-100">
						リンクが無効です。
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						パスワードリセットリンクが無効か、有効期限が切れています。新しいリセットリンクをリクエストしてください。
					</p>
				</div>

				{/* Error Details Card */}
				<div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
					<div className="mb-4">
						<h4 className="mb-2 font-medium text-red-800 dark:text-red-200">
							考えられる原因:
						</h4>
						<ul className="space-y-1 text-red-600 dark:text-red-400">
							<li>・リセットリンクの有効期限が切れています</li>
							<li>・リンクが既に使用されています</li>
							<li>・リンクが正しくコピーされていません</li>
						</ul>
					</div>

					<div className="text-red-600 dark:text-red-400">
						<strong>解決策:</strong>{" "}
						メールアドレスを使用して新しいパスワードリセットリンクをリクエストしてください。
					</div>
				</div>

				{/* Action Buttons */}
				<div className="space-y-4">
					<Link to="/request-reset-password" className="block w-full">
						<div className="flex w-full items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600">
							<ArrowLeft width={20} />
							再試行する
						</div>
					</Link>

					<Link to="/sign-in" className="block w-full">
						<div className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
							サインインページへ戻る
							<ArrowRight width={20} />
						</div>
					</Link>
				</div>

				{/* Help Text */}
				<div className="text-center">
					<p className="text-gray-500 dark:text-gray-400">
						問題が解決しない場合は、サポートにお問い合わせください。
					</p>
				</div>
			</div>
		);
	}

	return <ResetPassword token={token} />;
}

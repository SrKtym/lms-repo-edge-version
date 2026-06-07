import { authClient } from "@lms-repo-edge-version/auth/web";
import { env } from "@lms-repo-edge-version/env/web";
import { AccountSettings } from "@lms-repo-edge-version/ui/components/surfaces/account-settings";
import { NotificationSettings } from "@lms-repo-edge-version/ui/components/surfaces/notification-settings";
import { UserProfileInfo } from "@lms-repo-edge-version/ui/components/surfaces/user-profile-info";
import { TabsForProfile } from "@lms-repo-edge-version/ui/components/tabs";
import { toast } from "@lms-repo-edge-version/ui/components/toast";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	useEmailNotificationSettings,
	useUpdateEmailNotificationSettings,
} from "@/hooks/settings";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import {
	fetchCompletedCoursesQueryFn,
	fetchEmailNotificationSettingsQueryFn,
	fetchStudentDataQueryFn,
} from "@/utils/query-utils";

export const Route = createFileRoute("/_my-page/profile")({
	component: RouteComponent,
	loader: async ({ context }) => {
		if (!context.session.data?.user) {
			throw new Error("User not found");
		}
		const { email, name, image, role } = context.session.data.user;

		const [studentData, completedCourses, initialSettings] = await Promise.all([
			queryClient.ensureQueryData({
				queryKey: ["studentData"],
				queryFn: fetchStudentDataQueryFn,
				...QUERY_CONFIG.STUDENT_DATA,
			}),
			queryClient.ensureQueryData({
				queryKey: ["totalCredits"],
				queryFn: fetchCompletedCoursesQueryFn,
				...QUERY_CONFIG.STUDENT_DATA,
			}),
			queryClient.ensureQueryData({
				queryKey: ["email-notification-settings"],
				queryFn: fetchEmailNotificationSettingsQueryFn,
				...QUERY_CONFIG.STUDENT_DATA,
			}),
		]);

		return {
			email,
			name,
			image,
			role,
			studentData,
			completedCourses,
			initialSettings,
		};
	},
	head: () => ({
		meta: [
			{
				title: "プロフィール | LMS-repo",
			},
		],
	}),
});

function RouteComponent() {
	const { studentData, completedCourses, initialSettings, ...userData } =
		Route.useLoaderData();
	const user = { ...userData, ...completedCourses[0], ...studentData[0] };

	// トースト表示
	function showToast(error: { status: number }) {
		switch (error.status) {
			case 400:
			case 404:
				toast.danger("アカウント削除に失敗しました");
				break;
			case 500:
				toast.danger(
					"予期しないエラーが発生しました。お手数ですが再度試行してください。",
				);
		}
	}

	// アカウント削除処理
	const handleDeleteAccount = async () => {
		const { error } = await authClient.deleteUser({
			callbackURL: env.VITE_CLIENT_URL,
		});
		if (error) {
			showToast(error);
		} else {
			toast.success(
				`${user.name}に確認メールを送信しました。メールに添付されたリンクからアカウント削除を完了してください。`,
			);
		}
	};

	const { data: emailNotificationSettings = [] } =
		useEmailNotificationSettings(initialSettings);

	// メール通知設定変更時の処理
	const { mutate: updateEmailNotificationSettings } =
		useUpdateEmailNotificationSettings();

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			{/* ページタイトル */}
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl text-foreground">
					プロフィール
				</h1>
				<p className="text-foreground-600">
					ユーザー情報の確認とアカウント設定の管理
				</p>
			</div>

			{/* タブコンテンツ */}
			<TabsForProfile
				profileTab={<UserProfileInfo user={user} />}
				accountSettingsTab={
					<AccountSettings
						LinkComponent={Link}
						onDeleteAccount={handleDeleteAccount}
					/>
				}
				notificationSettingsTab={
					<NotificationSettings
						initialSettings={emailNotificationSettings}
						onSettingsChange={updateEmailNotificationSettings}
					/>
				}
			/>
		</div>
	);
}

import type { EmailNotificationSettings } from "@lms-repo-edge-version/db/types";
import type { FetchEmailNotificationSettings } from "@lms-repo-edge-version/db/utils/query/settings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import { fetchEmailNotificationSettingsQueryFn } from "@/utils/query-utils";

// メール通知設定を取得するカスタムフック
export const useEmailNotificationSettings = (
	initialData?: FetchEmailNotificationSettings,
) => {
	return useQuery({
		queryKey: ["email-notification-settings"],
		queryFn: fetchEmailNotificationSettingsQueryFn,
		...QUERY_CONFIG.STUDENT_DATA,
		initialData,
	});
};

// メール通知設定を更新するカスタムフック
export const useUpdateEmailNotificationSettings = () => {
	return useMutation({
		mutationFn: async (settings: Omit<EmailNotificationSettings, "userId">) => {
			const res = await client.api.settings.email_notification.$post({
				json: settings,
			});
			const data = await res.json();
			return data;
		},
		onMutate: async (newSettings) => {
			// 古いデータの再取得をキャンセルする
			await queryClient.cancelQueries({
				queryKey: ["email-notification-settings"],
			});

			// 更新前のデータを保存し、エラー発生時のロールバック用に使用
			const previousSettings = queryClient.getQueryData([
				"email-notification-settings",
			]);

			// 楽観的更新
			queryClient.setQueryData(["email-notification-settings"], newSettings);

			return { previousSettings };
		},
		onError: (_err, _newSettings, context) => {
			// ミューテーションが失敗した場合、ロールバック用データをコンテキストから受け取る
			if (context?.previousSettings) {
				queryClient.setQueryData(
					["email-notification-settings"],
					context.previousSettings,
				);
			}
		},
		onSettled: () => {
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({
				queryKey: ["email-notification-settings"],
			});
		},
	});
};

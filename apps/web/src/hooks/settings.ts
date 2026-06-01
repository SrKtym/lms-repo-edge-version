import type { EmailNotificationSettings } from "@lms-repo-edge-version/db/types";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";

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
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["email-notification-settings"],
			});
		},
	});
};

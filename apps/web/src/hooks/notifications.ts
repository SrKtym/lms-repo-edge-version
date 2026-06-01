import type { FetchNotificationsReturnType } from "@lms-repo-edge-version/db/utils/query/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import { fetchNotificationsQueryFn } from "@/utils/query-utils";

// 通知一覧を取得するカスタムフック（ポーリング対応）
export const useNotifications = (
	initialData?: FetchNotificationsReturnType,
	options?: {
		enabled?: boolean;
		refetchInterval?: number;
	},
) => {
	const { enabled = true, refetchInterval = 10000 } = options || {}; // デフォルト10秒間隔

	return useQuery({
		queryKey: ["notifications"],
		queryFn: fetchNotificationsQueryFn,
		staleTime: 5 * 60 * 1000, // 5 minutes
		initialData: initialData,
		enabled,
		refetchInterval, // ポーリング間隔を設定
		refetchIntervalInBackground: true, // バックグラウンドでもポーリング
		retry: 3, // 失敗時のリトライ回数
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
	});
};

// 指定された通知を既読にするカスタムフック
export const useMarkNotificationAsRead = () => {
	return useMutation({
		mutationFn: async (notificationId: string) => {
			const res = await client.api.notifications[":id"].mark_as_read.$patch({
				param: {
					id: notificationId,
				},
			});
			const data = await res.json();
			return data;
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

// 全通知を既読にするカスタムフック
export const useMarkAllNotificationsAsRead = () => {
	return useMutation({
		mutationFn: async () => {
			const res = await client.api.notifications.mark_all_as_read.$patch();
			const data = await res.json();
			return data;
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

// 通知を削除するカスタムフック
export const useDeleteNotification = () => {
	return useMutation({
		mutationFn: async (notificationId: string) => {
			const res = await client.api.notifications[":id"].$delete({
				param: {
					id: notificationId,
				},
			});
			const data = await res.json();
			return data;
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

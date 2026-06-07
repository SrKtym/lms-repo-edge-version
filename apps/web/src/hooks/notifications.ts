import type { FetchNotificationsReturnType } from "@lms-repo-edge-version/db/utils/query/notifications";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import {
	fetchNotificationsCountQueryFn,
	fetchNotificationsQueryFn,
} from "@/utils/query-utils";

// 通知一覧を取得するカスタムフック（無限スクロール・ポーリング対応）
export const useNotifications = (
	limit?: number,
	initialData?: FetchNotificationsReturnType,
) => {
	return useInfiniteQuery({
		queryKey: ["notifications", limit],
		queryFn: async ({ pageParam }) => {
			return fetchNotificationsQueryFn(limit || 10, pageParam * (limit || 10));
		},
		enabled: true,
		initialPageParam: 0,
		initialData: initialData
			? {
					pages: [initialData],
					pageParams: [0],
				}
			: undefined,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < 10) {
				return; // データが10件未満の場合はこれ以上データがない
			}
			return allPages.length; // 次のページ番号
		},
		refetchInterval: 10000, // ポーリング間隔10秒を設定
		refetchIntervalInBackground: true, // バックグラウンドでもポーリング
		retry: 3, // 失敗時のリトライ回数
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
	});
};

// 通知一覧を取得するカスタムフック（従来のページネーション対応）
export const useNotificationsPaginated = (
	page: number,
	limit = 10,
	initialData?: FetchNotificationsReturnType,
) => {
	const offset = (page - 1) * limit;
	return useQuery({
		queryKey: ["notifications", page, limit],
		queryFn: () => fetchNotificationsQueryFn(limit, offset),
		initialData,
		staleTime: 0, // ページ変更時に即時再取得するため0に設定
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchInterval: 10000, // ポーリング間隔10秒を設定
		refetchIntervalInBackground: true, // バックグラウンドでもポーリング
		retry: 3, // 失敗時のリトライ回数
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
	});
};

// 通知総数を取得するカスタムフック
export const useNotificationsCount = (filter?: "all" | "unread" | "read") => {
	return useQuery({
		queryKey: ["notifications", "count", filter],
		queryFn: () => fetchNotificationsCountQueryFn(filter),
		refetchInterval: 10000, // ポーリング間隔10秒を設定
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
			// ミューテーションの成功時も失敗時も再フェッチする
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
			// ミューテーションの成功時も失敗時も再フェッチする
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
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};

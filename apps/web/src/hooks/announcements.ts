import type { FetchAnnouncementsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/announcements";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import { fetchAnnouncementsQueryFn } from "../utils/query-utils";

// 登録済み講義に関連するアナウンスメントを取得するカスタムフック
export const useAnnouncements = (
	initialData?: FetchAnnouncementsFromUserCoursesReturnType,
) => {
	return useQuery({
		queryKey: ["announcements"],
		queryFn: fetchAnnouncementsQueryFn,
		initialData,
	});
};

// アナウンスメントを作成するカスタムフック
export const useCreateAnnouncement = () => {
	return useMutation({
		mutationFn: async (announcementData: {
			title: string;
			description: string;
			type: string;
			courseId: string;
		}) => {
			const res = await client.api.announcements.$post({
				json: announcementData,
			});
			const data = await res.json();
			return data;
		},
		onMutate: async (newAnnouncement) => {
			// 古いデータの再取得をキャンセルする
			await queryClient.cancelQueries({
				queryKey: ["announcements"],
			});

			// 更新前のデータを保存し、エラー発生時のロールバック用に使用
			const previousAnnouncements = queryClient.getQueryData(["announcements"]);

			// 楽観的更新
			queryClient.setQueryData(
				["announcements"],
				(old?: FetchAnnouncementsFromUserCoursesReturnType) => [
					...(old ?? []),
					newAnnouncement,
				],
			);

			return { previousAnnouncements };
		},
		onSettled: () => {
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({ queryKey: ["announcements"] });
		},
	});
};

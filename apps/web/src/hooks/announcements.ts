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
		staleTime: 5 * 60 * 1000, // 5 minutes
		initialData: initialData,
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
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["announcements"] });
		},
	});
};

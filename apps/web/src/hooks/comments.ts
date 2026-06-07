import type {
	Comments,
	CommentsOptional,
} from "@lms-repo-edge-version/db/types";
import type { FetchCommentsWithAssignmentReturnType } from "@lms-repo-edge-version/db/utils/query/comments";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import { fetchCommentsWithAssignmentQueryFn } from "../utils/query-utils";

// 課題についてのコメントを取得するカスタムフック
export const useCommentsWithAssignment = (assignmentId: string) => {
	return useQuery({
		queryKey: ["comments-with-assignment", assignmentId],
		queryFn: () => fetchCommentsWithAssignmentQueryFn(assignmentId),
		...QUERY_CONFIG.STUDENT_DATA,
	});
};

// コメントを作成するカスタムフック
export const useCreateComment = () => {
	return useMutation({
		mutationFn: async (comment: Omit<Comments, CommentsOptional>) => {
			const res = await client.api.comments.$post({
				json: comment,
			});
			const data = await res.json();
			return data;
		},
		onMutate: async (newComment) => {
			// 古いデータの再取得をキャンセルする
			await queryClient.cancelQueries({
				queryKey: ["comments-with-assignment"],
			});

			// 更新前のデータを保存し、エラー発生時のロールバック用に使用
			const previousComments = queryClient.getQueryData([
				"comments-with-assignment",
			]);

			// 楽観的更新
			queryClient.setQueryData(
				["comments-with-assignment"],
				(old: FetchCommentsWithAssignmentReturnType) => {
					return [...old, newComment];
				},
			);

			return { previousComments };
		},
		onSettled: () => {
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({ queryKey: ["comments-with-assignment"] });
		},
	});
};

import type {
	Comments,
	CommentsOptional,
} from "@lms-repo-edge-version/db/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import { fetchCommentsWithAssignmentQueryFn } from "../utils/query-utils";

// 講義についてのコメントを取得するカスタムフック
export const useCommentsWithAssignment = (assignmentId: string) => {
	return useQuery({
		queryKey: ["comments-with-assignment", assignmentId],
		queryFn: () => fetchCommentsWithAssignmentQueryFn(assignmentId),
		staleTime: 24 * 60 * 60 * 1000, // 24 hours
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
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["comments-with-assignment"] });
		},
	});
};

import type { Assignments } from "@lms-repo-edge-version/db/types";
import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import { fetchAssignmentsQueryFn } from "../utils/query-utils";

// 登録済み講義に関連する課題を取得するカスタムフック
export const useAssignments = (
	initialData?: FetchAssignmentsFromUserCoursesReturnType,
) => {
	return useQuery({
		queryKey: ["assignments"],
		queryFn: fetchAssignmentsQueryFn,
		initialData,
	});
};

// 課題を作成するカスタムフック
export const useCreateAssignment = () => {
	return useMutation({
		mutationFn: async (assignmentData: Assignments) => {
			const res = await client.api.assignments.$post({
				json: assignmentData,
			});
			const data = await res.json();
			return data;
		},
		onMutate: async (newAssignment) => {
			// 古いデータの再取得をキャンセルする
			await queryClient.cancelQueries({
				queryKey: ["assignments"],
			});

			// 更新前のデータを保存し、エラー発生時のロールバック用に使用
			const previousAssignments = queryClient.getQueryData(["assignments"]);

			// 楽観的更新
			queryClient.setQueryData(
				["assignments"],
				(old?: FetchAssignmentsFromUserCoursesReturnType) => [
					...(old ?? []),
					newAssignment,
				],
			);

			return { previousAssignments };
		},
		onError: (_err, _newAssignment, context) => {
			// ミューテーションが失敗した場合、ロールバック用データをコンテキストから受け取る
			if (context?.previousAssignments) {
				queryClient.setQueryData(["assignments"], context.previousAssignments);
			}
		},
		onSettled: () => {
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
		},
	});
};

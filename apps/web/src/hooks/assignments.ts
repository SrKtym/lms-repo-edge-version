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
		staleTime: 5 * 60 * 1000, // 5 minutes
		initialData: initialData,
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
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
		},
	});
};

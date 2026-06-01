import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import { fetchMembersByCourseIdQueryFn } from "@/utils/query-utils";

// 講義を登録しているメンバーの取得
export const useMembersByCourseId = (courseId: string) => {
	return useQuery({
		queryKey: ["members-by-course-id", courseId],
		queryFn: () => fetchMembersByCourseIdQueryFn(courseId),
		staleTime: 24 * 60 * 60 * 1000, // 24 hours
	});
};

// 学生データ登録のミューテーション
export const useRegisterStudentData = () => {
	return useMutation({
		mutationFn: async (data: { grade: number; departmentName: string }) => {
			const res = await client.api.students.$post({
				json: data,
			});
			const result = await res.json();
			return result;
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};

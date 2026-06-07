import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import { fetchMembersByCourseIdQueryFn } from "@/utils/query-utils";

// 講義を登録しているメンバーの取得
export const useMembersByCourseId = (courseId: string) => {
	return useQuery({
		queryKey: ["members-by-course-id", courseId],
		queryFn: () => fetchMembersByCourseIdQueryFn(courseId),
		...QUERY_CONFIG.STUDENT_DATA,
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
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};

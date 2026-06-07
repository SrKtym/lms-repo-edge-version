import type {
	Schedules,
	SchedulesOptional,
} from "@lms-repo-edge-version/db/types";
import type { FetchSchedulesReturnType } from "@lms-repo-edge-version/db/utils/query/schedules";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import {
	fetchScheduleByIdQueryFn,
	fetchSchedulesQueryFn,
} from "@/utils/query-utils";

// スケジュールを取得するカスタムフック
export const useSchedules = (initialData?: FetchSchedulesReturnType) => {
	return useQuery({
		queryKey: ["schedules"],
		queryFn: fetchSchedulesQueryFn,
		initialData,
	});
};

// 単一のスケジュールを取得するカスタムフック
export const useFetchSchedule = (scheduleId: string) => {
	return useQuery({
		queryKey: ["schedule", scheduleId],
		queryFn: () => fetchScheduleByIdQueryFn(scheduleId),
		enabled: !!scheduleId,
	});
};

// スケジュールを作成するカスタムフック
export const useCreateSchedule = () => {
	return useMutation({
		mutationFn: async (scheduleData: Omit<Schedules, SchedulesOptional>) => {
			const res = await client.api.schedules.$post({
				json: scheduleData,
			});
			const data = await res.json();
			return data;
		},
		onMutate: async (scheduleData) => {
			// 古いデータの再取得をキャンセルする
			await queryClient.cancelQueries({ queryKey: ["schedules"] });

			// 更新前のデータを保存し、エラー発生時のロールバック用に使用
			const previousSchedules = queryClient.getQueryData(["schedules"]);

			// 楽観的更新
			queryClient.setQueryData(["schedules"], (old: Schedules[]) => [
				...old,
				{ ...scheduleData, id: "temp-id" },
			]);

			return { previousSchedules };
		},
		onError: (_err, _scheduleData, context) => {
			// ミューテーションが失敗した場合, ロールバック用データをコンテキストから受け取る
			if (context?.previousSchedules) {
				queryClient.setQueryData(["schedules"], context.previousSchedules);
			}
		},
		onSettled: () => {
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({ queryKey: ["schedules"] });
		},
	});
};

// スケジュールを削除するカスタムフック
export const useDeleteSchedule = () => {
	return useMutation({
		mutationFn: async (scheduleId: string) => {
			const res = await client.api.schedules.$delete({
				json: { scheduleId },
			});
			const data = await res.json();
			return data;
		},
		onMutate: async (scheduleId) => {
			// 古いデータの再取得をキャンセルする
			await queryClient.cancelQueries({ queryKey: ["schedules"] });

			// 更新前のデータを保存し、エラー発生時のロールバック用に使用
			const previousSchedules = queryClient.getQueryData(["schedules"]);

			// 楽観的更新
			queryClient.setQueryData(
				["schedules"],
				(old: Schedules[]) =>
					old?.filter((schedule) => schedule.id !== scheduleId) || [],
			);

			return { previousSchedules };
		},
		onError: (_err, _scheduleId, context) => {
			// ミューテーションが失敗した場合, ロールバック用データをコンテキストから受け取る
			if (context?.previousSchedules) {
				queryClient.setQueryData(["schedules"], context.previousSchedules);
			}
		},
		onSettled: () => {
			// ミューテーションの成功時も失敗時も再フェッチする
			queryClient.invalidateQueries({ queryKey: ["schedules"] });
		},
	});
};

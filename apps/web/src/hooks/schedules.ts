import type {
	Schedules,
	SchedulesOptional,
} from "@lms-repo-edge-version/db/types";
import type { FetchSchedulesReturnType } from "@lms-repo-edge-version/db/utils/query/schedules";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";
import { fetchSchedulesQueryFn } from "@/utils/query-utils";

export const useSchedules = (initialData?: FetchSchedulesReturnType) => {
	return useQuery({
		queryKey: ["schedules"],
		queryFn: fetchSchedulesQueryFn,
		initialData,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection)
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
};

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
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["schedules"] });

			// Snapshot the previous value
			const previousSchedules = queryClient.getQueryData(["schedules"]);

			// Optimistically update to the new value
			queryClient.setQueryData(["schedules"], (old: Schedules[]) => [
				...old,
				{ ...scheduleData, id: "temp-id" },
			]);

			return { previousSchedules };
		},
		onError: (_err, _scheduleData, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousSchedules) {
				queryClient.setQueryData(["schedules"], context.previousSchedules);
			}
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["schedules"] });
		},
	});
};

export const useDeleteSchedule = () => {
	return useMutation({
		mutationFn: async (scheduleId: string) => {
			const res = await client.api.schedules.$delete({
				json: scheduleId,
			});
			const data = await res.json();
			return data;
		},
		onMutate: async (scheduleId) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["schedules"] });

			// Snapshot the previous value
			const previousSchedules = queryClient.getQueryData(["schedules"]);

			// Optimistically update to the new value
			queryClient.setQueryData(
				["schedules"],
				(old: Schedules[]) =>
					old?.filter((schedule) => schedule.id !== scheduleId) || [],
			);

			return { previousSchedules };
		},
		onError: (_err, _scheduleId, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousSchedules) {
				queryClient.setQueryData(["schedules"], context.previousSchedules);
			}
		},
		onSettled: () => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["schedules"] });
		},
	});
};

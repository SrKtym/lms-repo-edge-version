import { AssignmentsProgressCard } from "@lms-repo-edge-version/ui/components/cards/assignments-progress-card";
import { DailySchedulesCard } from "@lms-repo-edge-version/ui/components/cards/daily-schedules-card";
import { NotificationsListCard } from "@lms-repo-edge-version/ui/components/cards/notifications-list-card";
import { UpcomingAssignmentsCard } from "@lms-repo-edge-version/ui/components/cards/upcoming-assignments-card";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	useDeleteNotification,
	useMarkAllNotificationsAsRead,
	useMarkNotificationAsRead,
	useNotifications,
} from "@/hooks/notifications";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import {
	fetchAssignmentsQueryFn,
	fetchNotificationsQueryFn,
	fetchRegisteredCoursesQueryFn,
	fetchSchedulesQueryFn,
	fetchSubmissionsQueryFn,
} from "@/utils/query-utils";

export const Route = createFileRoute("/_my-page/dashboard")({
	component: RouteComponent,
	loader: async () => {
		// キャッシュがあればキャッシュからデータ取得（既にプリフェッチ済み）
		const [courses, schedules, assignments, initialNotifications, submissions] =
			await Promise.all([
				queryClient.ensureQueryData({
					queryKey: ["registered-courses"],
					queryFn: fetchRegisteredCoursesQueryFn,
					...QUERY_CONFIG.STUDENT_DATA,
				}),

				queryClient.ensureQueryData({
					queryKey: ["schedules"],
					queryFn: fetchSchedulesQueryFn,
				}),

				queryClient.ensureQueryData({
					queryKey: ["assignments-related-courses"],
					queryFn: fetchAssignmentsQueryFn,
				}),

				queryClient.ensureQueryData({
					queryKey: ["notifications"],
					queryFn: () => fetchNotificationsQueryFn(10, 0),
				}),
				queryClient.ensureQueryData({
					queryKey: ["submissions"],
					queryFn: fetchSubmissionsQueryFn,
				}),
			]);

		return {
			courses,
			schedules,
			assignments,
			initialNotifications,
			submissions,
		};
	},
	head: () => ({
		meta: [
			{
				title: "ダッシュボード | LMS-repo",
			},
		],
	}),
});

function RouteComponent() {
	const { courses, schedules, assignments, initialNotifications, submissions } =
		Route.useLoaderData();

	const {
		data: notificationsData,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useNotifications(10, initialNotifications);
	const notifications = notificationsData?.pages.flat() || [];
	const { mutate: markAsRead } = useMarkNotificationAsRead();
	const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
	const { mutate: deleteNotification } = useDeleteNotification();

	// アニメーションの再トリガーを防ぐため、DailySchedulesCardのpropsをメモ化
	const memoizedDailySchedulesProps = useMemo(
		() => ({
			courses,
			schedules,
		}),
		[courses, schedules],
	);

	// 期限切れの課題
	const overdueAssignments = assignments.filter(
		(assignment) => assignment.dueDate < new Date(),
	);

	return (
		<div className="p-3">
			{/* Dashboard Header */}
			<div className="mb-6 lg:mb-8">
				<h1 className="mb-2 font-bold text-2xl text-gray-900 lg:text-3xl dark:text-gray-100">
					ダッシュボード
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{new Date().toLocaleDateString("ja-JP", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
			</div>

			{/* Main Dashboard Grid */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
				{/* Desktop Layout - Left Column */}
				<div className="hidden lg:col-span-2 lg:block lg:space-y-6">
					<DailySchedulesCard {...memoizedDailySchedulesProps} />
					<UpcomingAssignmentsCard assignments={assignments} />
				</div>

				{/* Desktop Layout - Right Column */}
				<div className="hidden lg:block lg:space-y-6">
					<NotificationsListCard
						notifications={notifications}
						markAsRead={markAsRead}
						markAllAsRead={markAllAsRead}
						deleteNotification={deleteNotification}
						hasNextPage={hasNextPage}
						fetchNextPage={fetchNextPage}
						isFetchingNextPage={isFetchingNextPage}
					/>
					<AssignmentsProgressCard
						assignments={assignments}
						submissions={submissions}
						overdueAssignments={overdueAssignments}
					/>
				</div>

				{/* Mobile Layout - Custom Order */}
				<div className="space-y-4 lg:hidden">
					<DailySchedulesCard {...memoizedDailySchedulesProps} />
					<NotificationsListCard
						notifications={notifications}
						markAsRead={markAsRead}
						markAllAsRead={markAllAsRead}
						deleteNotification={deleteNotification}
						hasNextPage={hasNextPage}
						fetchNextPage={fetchNextPage}
						isFetchingNextPage={isFetchingNextPage}
					/>
					<UpcomingAssignmentsCard assignments={assignments} />
					<AssignmentsProgressCard
						assignments={assignments}
						submissions={submissions}
						overdueAssignments={overdueAssignments}
					/>
				</div>
			</div>
		</div>
	);
}

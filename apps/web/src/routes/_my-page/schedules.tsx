import type { FetchSchedulesReturnType } from "@lms-repo-edge-version/db/utils/query/schedules";
import { CalendarClock } from "@lms-repo-edge-version/ui/assets/icons/calendar-clock";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import { createFileRoute } from "@tanstack/react-router";
import * as m from "motion/react-m";
import { useState } from "react";
import { z } from "zod";
import { CreateScheduleForm } from "@/components/_my-page/schedules/create-schedule-form";
import { DayView } from "@/components/_my-page/schedules/day-view";
import { MonthView } from "@/components/_my-page/schedules/month-view";
import { WeekView } from "@/components/_my-page/schedules/week-view";
import { useDeleteSchedule, useSchedules } from "@/hooks/schedules";
import { useCourseEvents } from "@/hooks/use-course-events";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import {
	fetchRegisteredCoursesQueryFn,
	fetchSchedulesQueryFn,
} from "@/utils/query-utils";

const views = ["month", "week", "day"] as const;
type View = (typeof views)[number];
const searchSchema = z.object({
	view: z.enum(views).optional(),
});

export const Route = createFileRoute("/_my-page/schedules")({
	component: RouteComponent,
	validateSearch: (search) => searchSchema.parse(search),
	loaderDeps: ({ search: { view } }) => ({ view }),
	loader: async ({ deps: { view = "month" } }) => {
		// キャッシュからデータ取得（既にプリフェッチ済み）
		const [courses, initialSchedules] = await Promise.all([
			queryClient.ensureQueryData({
				queryKey: ["registered-courses"],
				queryFn: fetchRegisteredCoursesQueryFn,
				...QUERY_CONFIG.STUDENT_DATA,
			}),
			queryClient.ensureQueryData({
				queryKey: ["schedules"],
				queryFn: fetchSchedulesQueryFn,
			}),
		]);
		return { courses, initialSchedules, view };
	},
	head: () => ({
		meta: [
			{
				title: "スケジュール | LMS-repo",
			},
		],
	}),
});

function RouteComponent() {
	const { courses, initialSchedules, view } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const [selectedView, setSelectedView] = useState<View>(view);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [editingSchedule, setEditingSchedule] =
		useState<FetchSchedulesReturnType[number]>();
	const [isModalOpen, setIsModalOpen] = useState(false);

	// スケジュールデータを取得
	const { data: schedules = [] } = useSchedules(initialSchedules);
	// スケジュール削除用のミューテーション
	const { mutate: deleteSchedule } = useDeleteSchedule();

	const { getEventsForDay } = useCourseEvents(courses, schedules);

	// ビュー変更時の処理
	const handleViewChange = (view: View) => {
		setSelectedView(view);
		navigate({
			search: {
				view,
			},
		});
	};

	// 編集ボタンがクリックされた時
	const handleEditSchedule = (scheduleId: string) => {
		const schedule = schedules.find(({ id }) => id === scheduleId);
		setEditingSchedule(schedule);
		setIsModalOpen(true);
	};

	// 新規作成ボタンがクリックされた時
	const handleCreateSchedule = () => {
		setEditingSchedule(undefined);
		setIsModalOpen(true);
	};

	// 月の最初の日と最後の日を取得
	const getMonthRange = (date: Date) => {
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		return { firstDay, lastDay };
	};

	// 週の範囲を取得
	const getWeekRange = (date: Date) => {
		const startOfWeek = new Date(date);
		const day = startOfWeek.getDay();
		const diff = startOfWeek.getDate() - day;
		startOfWeek.setDate(diff);
		startOfWeek.setHours(0, 0, 0, 0);

		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		endOfWeek.setHours(23, 59, 59, 999);

		return { startOfWeek, endOfWeek };
	};

	// 月のカレンダーデータを生成
	const generateMonthCalendar = () => {
		const { firstDay, lastDay } = getMonthRange(currentDate);
		const calendar: Array<
			Array<{
				date: Date;
				isCurrentMonth: boolean;
				isToday: boolean;
			}>
		> = [];
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());

		// 6 weeks iteration
		Array.from({ length: 6 }).forEach((_, week) => {
			const weekData: Array<{
				date: Date;
				isCurrentMonth: boolean;
				isToday: boolean;
			}> = [];

			// 7 days iteration
			Array.from({ length: 7 }).forEach((_, day) => {
				const currentDate = new Date(startDate);
				currentDate.setDate(startDate.getDate() + week * 7 + day);

				weekData.push({
					date: currentDate,
					isCurrentMonth: currentDate.getMonth() === firstDay.getMonth(),
					isToday: isSameDay(currentDate, new Date()),
				});
			});

			calendar.push(weekData);
			if (weekData[0] && weekData[0].date > lastDay) return;
		});

		return calendar;
	};

	// 週カレンダーデータを生成
	const generateWeekCalendar = () => {
		const { startOfWeek } = getWeekRange(currentDate);
		const weekData = [];

		for (let i = 0; i < 7; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);

			weekData.push({
				date,
				isToday: isSameDay(date, new Date()),
			});
		}

		return weekData;
	};

	// 同じ日かどうかを判定
	const isSameDay = (date1: Date, date2: Date) => {
		if (!date1 || !date2) return false;
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	// 月を変更
	const changeMonth = (direction: number) => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + direction);
		setCurrentDate(newDate);
	};

	// 週を変更
	const changeWeek = (direction: number) => {
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + direction * 7);
		setCurrentDate(newDate);
	};

	// 日を変更
	const changeDay = (direction: number) => {
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + direction);
		setCurrentDate(newDate);
	};

	// 月ビューの呼び出し
	const renderMonthView = () => (
		<MonthView
			currentDate={currentDate}
			calendar={generateMonthCalendar()}
			changeMonth={changeMonth}
			getEventsForDay={getEventsForDay}
			deleteSchedule={deleteSchedule}
			editSchedule={handleEditSchedule}
		/>
	);

	// 週ビューの呼び出し
	const renderWeekView = () => (
		<WeekView
			weekData={generateWeekCalendar()}
			changeWeek={changeWeek}
			getEventsForDay={getEventsForDay}
			deleteSchedule={deleteSchedule}
			editSchedule={handleEditSchedule}
		/>
	);

	// 日ビューの呼び出し
	const renderDayView = () => (
		<DayView
			currentDate={currentDate}
			changeDay={changeDay}
			getEventsForDay={getEventsForDay}
			deleteSchedule={deleteSchedule}
			editSchedule={handleEditSchedule}
		/>
	);

	return (
		<div className="space-y-6 p-3">
			<LazyMotionProvider>
				{/* ヘッダー */}
				<m.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div>
						<h1 className="font-bold text-2xl text-gray-900 dark:text-white">
							スケジュール
						</h1>
						<p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
							登録済み講義とスケジュールの管理
						</p>
					</div>

					<div className="flex items-center space-x-3">
						<div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
							{views.map((view) => (
								<m.button
									key={view}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => {
										setSelectedView(view);
										handleViewChange(view);
									}}
									className={`rounded-md px-4 py-2 font-medium text-sm transition-colors${
										selectedView === view
											? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
											: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
									}
								`}
								>
									{view === "month" ? "月" : view === "week" ? "週" : "日"}
								</m.button>
							))}
							<DefaultButton onPress={handleCreateSchedule}>
								<CalendarClock />
								スケジュールを追加
							</DefaultButton>
						</div>
					</div>
				</m.div>

				<CreateScheduleForm
					initialData={editingSchedule}
					isOpen={isModalOpen}
					onOpenChange={setIsModalOpen}
				/>

				{/*  */}
				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					{selectedView === "month" && renderMonthView()}
					{selectedView === "week" && renderWeekView()}
					{selectedView === "day" && renderDayView()}
				</m.div>
			</LazyMotionProvider>
		</div>
	);
}

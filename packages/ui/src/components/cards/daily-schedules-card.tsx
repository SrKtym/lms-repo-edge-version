import type { FetchRegisteredCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/courses";
import type { FetchSchedulesReturnType } from "@lms-repo-edge-version/db/utils/query/schedules";
import { CalendarAnimation } from "@lms-repo-edge-version/ui/assets/icons/calendar-animation";
import { usePeriodTime } from "@lms-repo-edge-version/ui/hooks/use-period-time";
import { cn } from "@lms-repo-edge-version/ui/lib/utils";
import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { memo } from "react";
import { BaseCard } from "../cards/base-card";

// 現在進行中であるかどうかを判定
const isProgressingOrUpcoming = (start: Date, end: Date) => {
	const now = new Date();
	const isProgressing = start < now && end > now;
	const upcoming = now < start;

	if (isProgressing) {
		return "progressing";
	}
	if (upcoming) {
		return "upcoming";
	}
	return "past";
};

function DailySchedulesCardComponent({
	courses,
	schedules,
}: {
	courses: FetchRegisteredCoursesReturnType;
	schedules: FetchSchedulesReturnType;
}) {
	const { periodToTime } = usePeriodTime();

	// 本日の講義を取得
	const todayCourse = courses
		.filter((course) => course.weekdays === new Date().getDay())
		.map((course) => {
			const times = periodToTime(course.period);

			return {
				...course,
				start: times.start,
				end: times.end,
				title: course.name,
			};
		});

	// 本日のスケジュールを取得
	const todaySchedule = schedules.map((schedule) => ({
		...schedule,
		start: schedule.startTime,
		end: schedule.endTime,
	}));

	// 講義用カードコンポーネント
	const CourseScheduleCard = ({
		item,
		index,
	}: {
		item: (typeof todayCourse)[number];
		index: number;
	}) => {
		const status = isProgressingOrUpcoming(item.start, item.end);
		const isPast = status === "past";
		const isProgressing = status === "progressing";

		return (
			<m.div
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: isPast ? 0.6 : 1, x: 0 }}
				transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
				className={cn(
					"rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
					isProgressing &&
						"bg-blue-50 shadow-md ring-2 ring-blue-500 dark:bg-blue-950",
					!isPast &&
						"hover:border-blue-300 hover:shadow-md dark:hover:border-blue-600",
				)}
			>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-3">
							<span
								className={cn(
									"rounded-full px-2 py-1 font-medium text-xs",
									isProgressing
										? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
										: isPast
											? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
											: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
								)}
							>
								{item.start.toLocaleTimeString("default", {
									hour: "2-digit",
									minute: "2-digit",
								})}{" "}
								-{" "}
								{item.end.toLocaleTimeString("default", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
						<h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
							{item.title}
						</h3>
					</div>
					{isProgressing && (
						<m.div
							animate={{ scale: [1, 1.1, 1] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
							className="h-2 w-2 rounded-full bg-blue-500"
						/>
					)}
				</div>
			</m.div>
		);
	};

	// 個人スケジュール用カードコンポーネント
	const ScheduleCard = ({
		item,
		index,
	}: {
		item: (typeof todaySchedule)[number];
		index: number;
	}) => {
		const status = isProgressingOrUpcoming(item.start, item.end);
		const isPast = status === "past";
		const isProgressing = status === "progressing";

		return (
			<m.div
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: isPast ? 0.6 : 1, x: 0 }}
				transition={{
					delay: index * 0.1 + 0.2,
					duration: 0.4,
					ease: "easeOut",
				}}
				className={cn(
					"rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm transition-all duration-300 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950",
					isProgressing &&
						"from-green-50 to-emerald-50 shadow-md ring-2 ring-green-500 dark:from-green-950 dark:to-emerald-950",
					!isPast &&
						"hover:border-green-300 hover:shadow-md dark:hover:border-green-600",
				)}
			>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-3">
							<span
								className={cn(
									"rounded-full px-2 py-1 font-medium text-xs",
									isProgressing
										? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
										: isPast
											? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
											: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
								)}
							>
								{item.start.toLocaleTimeString("default", {
									hour: "2-digit",
									minute: "2-digit",
								})}{" "}
								-{" "}
								{item.end.toLocaleTimeString("default", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
						<h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
							{item.title}
						</h3>
						{item.description && (
							<p className="mb-2 text-gray-600 text-sm dark:text-gray-400">
								{item.description}
							</p>
						)}
					</div>
					{isProgressing && (
						<m.div
							animate={{ scale: [1, 1.1, 1] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
							className="h-2 w-2 rounded-full bg-green-500"
						/>
					)}
				</div>
			</m.div>
		);
	};

	return (
		<BaseCard className="overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-lg backdrop-blur-sm dark:from-gray-800 dark:to-blue-900/20">
			{/* Decorative background elements */}
			<div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl" />
			<div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-400/10 blur-xl" />

			<div className="relative z-10 flex flex-col">
				<div className="mb-6 flex items-center gap-3">
					<CalendarAnimation width={24} height={24} />
					<div>
						<h1 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
							本日の予定
						</h1>
						<p className="text-gray-600 text-sm dark:text-gray-400">
							{new Date().toLocaleDateString("ja-JP", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
				</div>

				{todayCourse.length === 0 && todaySchedule.length === 0 ? (
					<div className="relative p-12 text-center">
						<div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/30" />
						<div className="relative z-10">
							<p className="mt-4 font-medium text-gray-500 dark:text-gray-400">
								本日の予定はありません
							</p>
							<p className="mt-2 text-gray-400 text-sm dark:text-gray-500">
								リラックスしてお過ごしください
							</p>
						</div>
					</div>
				) : (
					<div className="space-y-6">
						<LazyMotion features={domAnimation}>
							{/* 講義セクション */}
							{todayCourse.length > 0 && (
								<m.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, ease: "easeOut" }}
								>
									<h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800 text-lg dark:text-gray-200">
										<span className="h-2 w-2 rounded-full bg-blue-500" />
										講義
									</h2>
									<div className="space-y-3 p-1 lg:max-h-[240px] lg:overflow-y-auto">
										{todayCourse.map((item, index) => (
											<CourseScheduleCard
												key={item.id}
												item={item}
												index={index}
											/>
										))}
									</div>
								</m.div>
							)}

							{/* 個人スケジュールセクション */}
							{todaySchedule.length > 0 && (
								<m.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.5,
										delay: 0.2,
										ease: "easeOut",
									}}
								>
									<h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800 text-lg dark:text-gray-200">
										<span className="h-2 w-2 rounded-full bg-green-500" />
										個人スケジュール
									</h2>
									<div className="space-y-3 p-1 lg:max-h-[240px] lg:overflow-y-auto">
										{todaySchedule.map((item, index) => (
											<ScheduleCard key={item.id} item={item} index={index} />
										))}
									</div>
								</m.div>
							)}
						</LazyMotion>
					</div>
				)}
			</div>
		</BaseCard>
	);
}

export const DailySchedulesCard = memo(DailySchedulesCardComponent);

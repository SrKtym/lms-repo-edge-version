import { ArrowLeft } from "@lms-repo-edge-version/ui/assets/icons/arrow-left";
import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import { DAYS } from "@lms-repo-edge-version/ui/lib/utils";
import * as m from "motion/react-m";
import type { Event } from "@/hooks/use-course-events";
import { CurrentTimeIndicator } from "./current-time-indicator";

interface WeekDay {
	date: Date;
	isToday: boolean;
}

interface WeekViewProps {
	weekData: WeekDay[];
	changeWeek: (direction: number) => void;
	getEventsForDay: (date: Date) => Event[];
}

export function WeekView({
	weekData,
	changeWeek,
	getEventsForDay,
}: WeekViewProps) {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	return (
		<LazyMotionProvider>
			<div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
				{/* ヘッダー */}
				<div className="flex items-center justify-between border-gray-200 border-b p-4 dark:border-gray-700">
					<m.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => changeWeek(-1)}
						className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<ArrowLeft />
					</m.button>

					<m.h2
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="font-semibold text-gray-900 text-lg dark:text-white"
					>
						{weekData[0]?.date.toLocaleDateString("ja-JP", {
							month: "long",
							day: "numeric",
						})}{" "}
						-{" "}
						{weekData[6]?.date.toLocaleDateString("ja-JP", {
							month: "long",
							day: "numeric",
						})}
					</m.h2>

					<m.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => changeWeek(1)}
						className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<ArrowRight />
					</m.button>
				</div>

				{/* 週カレンダー */}
				<div className="flex">
					{/* 時間列 */}
					<div className="w-16 border-gray-200 border-r dark:border-gray-700">
						{/* 曜日ヘッダー用のスペース */}
						<div className="h-16 border-gray-200 border-b dark:border-gray-700" />
						{hours.map((hour) => (
							<div
								key={hour}
								className="h-16 border-gray-100 border-b p-1 dark:border-gray-700"
							>
								<div className="text-gray-500 text-xs dark:text-gray-400">
									{hour.toString().padStart(2, "0")}:00
								</div>
							</div>
						))}
					</div>

					{/* 日列 */}
					<div className="grid flex-1 grid-cols-7">
						{weekData.map((day, dayIndex) => {
							const events = getEventsForDay(day.date);
							const isToday = day.isToday;

							return (
								<m.div
									key={dayIndex}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: dayIndex * 0.05 }}
									className="border-gray-200 border-r dark:border-gray-700"
								>
									{/* 日付ヘッダー */}
									<div
										className={`h-16 border-gray-200 border-b p-2 text-center dark:border-gray-700 ${
											isToday
												? "bg-blue-50 dark:bg-blue-900/20"
												: "bg-gray-50 dark:bg-gray-800"
										}`}
									>
										<div
											className={`font-medium text-xs ${
												day.date.getDay() === 0
													? "text-red-500 dark:text-red-400"
													: day.date.getDay() === 6
														? "text-blue-500 dark:text-blue-400"
														: "text-gray-600 dark:text-gray-400"
											}`}
										>
											{DAYS[day.date.getDay()]}
										</div>
										<div
											className={`font-bold text-sm ${
												isToday
													? "text-blue-600 dark:text-blue-400"
													: "text-gray-900 dark:text-white"
											}`}
										>
											{day.date.getDate()}
										</div>
									</div>

									{/* 時間枠 */}
									<div className="relative">
										{hours.map((hour) => (
											<div
												key={hour}
												className="h-16 border-gray-100 border-b dark:border-gray-700"
											/>
										))}

										{/* 現在時刻インジケーター - 今日のみ表示 */}
										{isToday && <CurrentTimeIndicator pixelsPerHour={64} />}

										{/* イベント */}
										{events.map((event) => {
											const startHour = event.startTime.getHours();
											const startMinute = event.startTime.getMinutes();
											const endHour = event.endTime.getHours();
											const endMinute = event.endTime.getMinutes();

											const top = (startHour + startMinute / 60) * 64;
											const height =
												(endHour +
													endMinute / 60 -
													(startHour + startMinute / 60)) *
												64;

											return (
												<m.div
													key={event.id}
													initial={{ opacity: 0, scale: 0.8, y: -10 }}
													animate={{ opacity: 1, scale: 1, y: 0 }}
													transition={{
														delay: events.indexOf(event) * 0.1,
														duration: 0.3,
													}}
													className={
														"absolute right-1 left-1 rounded p-1 text-white text-xs"
													}
													style={{
														top: `${top}px`,
														height: `${height}px`,
														minHeight: "20px",
														backgroundColor: event.theme,
													}}
													whileHover={{ scale: 1.02, zIndex: 10 }}
												>
													<div className="truncate font-medium">
														{event.title}
													</div>
													<div className="text-xs opacity-90">
														{event.startTime.toLocaleTimeString("ja-JP", {
															hour: "2-digit",
															minute: "2-digit",
														})}{" "}
														-{" "}
														{event.endTime.toLocaleTimeString("ja-JP", {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</div>
													{event.description && (
														<div className="mt-1 line-clamp-2 text-xs opacity-90">
															{event.description}
														</div>
													)}
												</m.div>
											);
										})}
									</div>
								</m.div>
							);
						})}
					</div>
				</div>
			</div>
		</LazyMotionProvider>
	);
}

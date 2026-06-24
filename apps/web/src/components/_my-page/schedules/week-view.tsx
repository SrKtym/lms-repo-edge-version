import { ArrowLeft } from "@lms-repo-edge-version/ui/assets/icons/arrow-left";
import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import { MoreVertical } from "@lms-repo-edge-version/ui/assets/icons/more-vertical";
import { MenuActionButton } from "@lms-repo-edge-version/ui/components/button";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import {
	LongPressPopover,
	useLongPress,
} from "@lms-repo-edge-version/ui/components/popover";
import { DefaultTooltip } from "@lms-repo-edge-version/ui/components/tooltip";
import { useIsHoverCapable } from "@lms-repo-edge-version/ui/hooks/use-is-hover-capable";
import { DAYS } from "@lms-repo-edge-version/ui/lib/utils";
import * as m from "motion/react-m";
import { useState } from "react";
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
	deleteSchedule: (scheduleId: string) => void;
	editSchedule?: (scheduleId: string) => void;
}

interface WeekEventItemProps {
	event: Event;
	events: Event[];
	deleteSchedule: (scheduleId: string) => void;
	editSchedule?: (scheduleId: string) => void;
	onLongPress: (event: Event, position: { x: number; y: number }) => void;
}

function WeekEventItem({
	event,
	events,
	deleteSchedule,
	editSchedule,
	onLongPress,
}: WeekEventItemProps) {
	const startHour = event.startTime.getHours();
	const startMinute = event.startTime.getMinutes();
	const endHour = event.endTime.getHours();
	const endMinute = event.endTime.getMinutes();

	const top = (startHour + startMinute / 60) * 64;
	const height =
		(endHour + endMinute / 60 - (startHour + startMinute / 60)) * 64;

	const isHoverCapable = useIsHoverCapable();
	const { handlers } = useLongPress((position) => onLongPress(event, position));

	return (
		<m.div
			key={event.id}
			initial={{ opacity: 0, scale: 0.8, y: -10 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{
				delay: events.indexOf(event) * 0.1,
				duration: 0.3,
			}}
			className="group absolute right-1 left-1 rounded p-1 text-white text-xs"
			style={{
				top: `${top}px`,
				height: `${height}px`,
				minHeight: "20px",
				backgroundColor: event.theme,
			}}
			whileHover={{ scale: 1.02, zIndex: 10 }}
			whileTap={!isHoverCapable ? { scale: 0.9 } : undefined}
			{...handlers}
		>
			<div className="truncate font-medium">
				{event.title}
				{event.type === "schedule" && (
					<div className="absolute top-0 right-[-5px] opacity-0 transition-opacity group-hover:opacity-100">
						<DefaultTooltip
							triggerElement={
								<MoreVertical
									width={26}
									height={26}
									className="rounded-full p-1 text-white"
								/>
							}
							content={
								<div className="flex flex-col gap-1">
									<MenuActionButton
										type="edit"
										onClick={(e) => {
											e?.stopPropagation();
											editSchedule?.(event.id);
										}}
									/>
									<MenuActionButton
										type="delete"
										onClick={(e) => {
											e?.stopPropagation();
											deleteSchedule(event.id);
										}}
									/>
								</div>
							}
						/>
					</div>
				)}
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
}

export function WeekView({
	weekData,
	changeWeek,
	getEventsForDay,
	deleteSchedule,
	editSchedule,
}: WeekViewProps) {
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [menuPosition, setMenuPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const handleLongPress = (
		event: Event,
		position: { x: number; y: number },
	) => {
		if (event.type === "schedule") {
			setSelectedEvent(event);
			setMenuPosition(position);
		}
	};

	const closeMenu = () => {
		setSelectedEvent(null);
		setMenuPosition(null);
	};

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
										{events.map((event) => (
											<WeekEventItem
												key={event.id}
												event={event}
												events={events}
												deleteSchedule={deleteSchedule}
												editSchedule={editSchedule}
												onLongPress={handleLongPress}
											/>
										))}
									</div>
								</m.div>
							);
						})}
					</div>
				</div>

				{/* 長押しメニュー */}
				{selectedEvent && menuPosition && (
					<LongPressPopover
						position={menuPosition}
						onEdit={() => {
							if (editSchedule && selectedEvent.type === "schedule") {
								editSchedule(selectedEvent.id);
							}
						}}
						onDelete={() => {
							if (selectedEvent.type === "schedule") {
								deleteSchedule(selectedEvent.id);
							}
						}}
						onClose={closeMenu}
					/>
				)}
			</div>
		</LazyMotionProvider>
	);
}

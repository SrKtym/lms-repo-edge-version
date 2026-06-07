import { ArrowLeft } from "@lms-repo-edge-version/ui/assets/icons/arrow-left";
import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import { MenuButton } from "@lms-repo-edge-version/ui/components/button";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import {
	LongPressPopover,
	useLongPress,
} from "@lms-repo-edge-version/ui/components/popover";
import { useIsHoverCapable } from "@lms-repo-edge-version/ui/hooks/use-is-hover-capable";
import { DAYS } from "@lms-repo-edge-version/ui/lib/utils";
import * as m from "motion/react-m";
import { useState } from "react";
import type { Event } from "@/hooks/use-course-events";

interface MonthDay {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
}

interface MonthViewProps {
	currentDate: Date;
	calendar: MonthDay[][];
	changeMonth: (direction: number) => void;
	getEventsForDay: (date: Date) => Event[];
	deleteSchedule: (scheduleId: string) => void;
	editSchedule?: (scheduleId: string) => void;
}

interface EventItemProps {
	event: Event;
	index: number;
	deleteSchedule: (scheduleId: string) => void;
	editSchedule?: (scheduleId: string) => void;
	onLongPress: (event: Event, position: { x: number; y: number }) => void;
}

function EventItem({
	event,
	index,
	deleteSchedule,
	editSchedule,
	onLongPress,
}: EventItemProps) {
	const isHoverCapable = useIsHoverCapable();
	const { handlers } = useLongPress((position) => onLongPress(event, position));

	return (
		<m.div
			key={event.id}
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.05 }}
			className="group relative truncate rounded p-1 text-white text-xs"
			style={{ backgroundColor: event.theme }}
			whileHover={{ scale: 1.05 }}
			whileTap={!isHoverCapable ? { scale: 0.9 } : undefined}
			{...handlers}
		>
			{event.title}
			{event.type === "schedule" && (
				<div className="absolute top-0 right-0 opacity-0 transition-opacity group-hover:opacity-100">
					<MenuButton
						onEdit={() => editSchedule?.(event.id)}
						onDelete={() => deleteSchedule(event.id)}
					/>
				</div>
			)}
		</m.div>
	);
}

function getMonthRange(date: Date) {
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	return { firstDay, lastDay };
}

export function MonthView({
	currentDate,
	calendar,
	changeMonth,
	getEventsForDay,
	deleteSchedule,
	editSchedule,
}: MonthViewProps) {
	const { firstDay } = getMonthRange(currentDate);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [menuPosition, setMenuPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	// 長押し処理
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
						onClick={() => changeMonth(-1)}
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
						{firstDay.toLocaleDateString("ja-JP", {
							year: "numeric",
							month: "long",
						})}
					</m.h2>

					<m.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => changeMonth(1)}
						className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<ArrowRight />
					</m.button>
				</div>

				{/* 曜日ヘッダー */}
				<div className="grid grid-cols-7 border-gray-200 border-b dark:border-gray-700">
					{DAYS.map((day, index) => (
						<div
							key={day}
							className={`p-2 text-center font-medium text-sm ${
								index === 0
									? "text-red-500"
									: index === 6
										? "text-blue-500"
										: "text-gray-700 dark:text-gray-300"
							}`}
						>
							{day}
						</div>
					))}
				</div>

				{/* カレンダーグリッド */}
				<div className="grid grid-cols-7">
					{calendar.map((week, weekIndex) =>
						week.map((day, dayIndex) => {
							const events = getEventsForDay(day.date);
							const isToday = day.isToday;
							const isCurrentMonth = day.isCurrentMonth;

							return (
								<m.div
									key={`${weekIndex}-${dayIndex}`}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
									className={`min-h-[80px] border-gray-200 border-r border-b p-1 dark:border-gray-700 ${!isCurrentMonth ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"}
									${isToday ? "bg-blue-50 dark:bg-blue-900/20" : ""}
								`}
								>
									<div
										className={`mb-1 font-medium text-sm ${
											isToday
												? "text-blue-600 dark:text-blue-400"
												: isCurrentMonth
													? "text-gray-900 dark:text-white"
													: "text-gray-400"
										}`}
									>
										{day.date.getDate()}
									</div>

									<div className="space-y-1">
										{events.slice(0, 3).map((event, index) => (
											<EventItem
												key={event.id}
												event={event}
												index={index}
												deleteSchedule={deleteSchedule}
												editSchedule={editSchedule}
												onLongPress={handleLongPress}
											/>
										))}
										{events.length > 3 && (
											<div className="text-gray-500 text-xs dark:text-gray-400">
												+{events.length - 3}件
											</div>
										)}
									</div>
								</m.div>
							);
						}),
					)}
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

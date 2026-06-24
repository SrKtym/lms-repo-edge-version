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
import * as m from "motion/react-m";
import { useState } from "react";
import type { Event } from "@/hooks/use-course-events";
import { CurrentTimeIndicator } from "./current-time-indicator";

interface DayViewProps {
	currentDate: Date;
	changeDay: (direction: number) => void;
	getEventsForDay: (date: Date) => Event[];
	deleteSchedule: (scheduleId: string) => void;
	editSchedule?: (scheduleId: string) => void;
}

interface DayEventItemProps {
	event: Event;
	events: Event[];
	deleteSchedule: (scheduleId: string) => void;
	editSchedule?: (scheduleId: string) => void;
	onLongPress: (event: Event, position: { x: number; y: number }) => void;
}

function DayEventItem({
	event,
	events,
	deleteSchedule,
	editSchedule,
	onLongPress,
}: DayEventItemProps) {
	const startHour = event.startTime.getHours();
	const startMinute = event.startTime.getMinutes();
	const endHour = event.endTime.getHours();
	const endMinute = event.endTime.getMinutes();

	const top = (startHour + startMinute / 60) * 80; // 80px per hour
	const height =
		(endHour + endMinute / 60 - (startHour + startMinute / 60)) * 80;

	const isHoverCapable = useIsHoverCapable();
	const { handlers } = useLongPress((position) => onLongPress(event, position));

	return (
		<m.div
			key={event.id}
			initial={{ opacity: 0, x: -20, scale: 0.9 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			transition={{
				delay: events.indexOf(event) * 0.1,
				duration: 0.4,
				type: "spring",
				stiffness: 100,
			}}
			className="group absolute right-2 left-2 rounded-lg p-3 text-white shadow-lg"
			style={{
				top: `${top}px`,
				height: `${height}px`,
				minHeight: "40px",
				backgroundColor: event.theme,
			}}
			whileHover={{
				scale: 1.02,
				zIndex: 10,
				boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
			}}
			whileTap={!isHoverCapable ? { scale: 0.95 } : undefined}
			{...handlers}
		>
			<div className="mb-1 font-bold text-sm">
				{event.title}
				{event.type === "schedule" && (
					<div className="absolute top-1 right-[-5px] opacity-0 transition-opacity group-hover:opacity-100">
						<DefaultTooltip
							triggerElement={
								<MoreVertical
									width={32}
									height={32}
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

export function DayView({
	currentDate,
	changeDay,
	getEventsForDay,
	deleteSchedule,
	editSchedule,
}: DayViewProps) {
	const events = getEventsForDay(currentDate);
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
						onClick={() => changeDay(-1)}
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
						{currentDate.toLocaleDateString("ja-JP", {
							year: "numeric",
							month: "long",
							day: "numeric",
							weekday: "long",
						})}
					</m.h2>

					<m.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => changeDay(1)}
						className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<ArrowRight />
					</m.button>
				</div>

				{/* 日カレンダー */}
				<div className="flex min-h-[600px]">
					{/* 時間列 */}
					<div className="w-20 border-gray-200 border-r dark:border-gray-700">
						{hours.map((hour) => (
							<div
								key={hour}
								className="h-20 border-gray-100 border-b p-2 dark:border-gray-700"
							>
								<div className="text-gray-500 text-sm dark:text-gray-400">
									{hour.toString().padStart(2, "0")}:00
								</div>
							</div>
						))}
					</div>

					{/* 時間枠 */}
					<div className="relative flex-1">
						{hours.map((hour, index) => (
							<m.div
								key={hour}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.02 }}
								className="h-20 border-gray-100 border-b dark:border-gray-700"
							/>
						))}

						{/* 現在時刻インジケーター */}
						{currentDate.toDateString() === new Date().toDateString() && (
							<CurrentTimeIndicator pixelsPerHour={80} />
						)}

						{events.map((event) => (
							<DayEventItem
								key={event.id}
								event={event}
								events={events}
								deleteSchedule={deleteSchedule}
								editSchedule={editSchedule}
								onLongPress={handleLongPress}
							/>
						))}
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
			</div>
		</LazyMotionProvider>
	);
}

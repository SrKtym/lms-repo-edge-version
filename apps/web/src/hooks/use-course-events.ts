import { usePeriodTime } from "@lms-repo-edge-version/ui/hooks/use-period-time";
import { useMemo } from "react";

export interface Course {
	id: string;
	name: string;
	classRoom: string;
	weekdays: number;
	period: number;
}

export interface Schedule {
	id: string;
	title: string;
	description?: string;
	startTime: string | Date;
	endTime: string | Date;
	theme: string;
}

export interface Event {
	id: string;
	title: string;
	description: string;
	startTime: Date;
	endTime: Date;
	theme: string;
	type: "course" | "schedule";
}

export const useCourseEvents = (courses: Course[], schedules: Schedule[]) => {
	const { periodToTime } = usePeriodTime();

	const getEventsForDay = useMemo(() => {
		return (date: Date): Event[] => {
			const events: Event[] = [];

			// Process courses
			courses.forEach((course) => {
				// Check if course matches the day of week
				if (
					course.weekdays === date.getDay() ||
					(course.weekdays === 7 && date.getDay() === 0)
				) {
					// Use the periodToTime function from usePeriodTime hook
					const timeSlot = periodToTime(course.period);

					const eventStart = new Date(date);
					eventStart.setHours(
						timeSlot.start.getHours(),
						timeSlot.start.getMinutes(),
						0,
						0,
					);

					const eventEnd = new Date(date);
					eventEnd.setHours(
						timeSlot.end.getHours(),
						timeSlot.end.getMinutes(),
						0,
						0,
					);

					events.push({
						id: course.id,
						title: course.name,
						description: course.classRoom,
						startTime: eventStart,
						endTime: eventEnd,
						theme: "#3b82f6",
						type: "course",
					});
				}
			});

			// Process schedules
			schedules.forEach((schedule) => {
				if (isSameDay(new Date(schedule.startTime), date)) {
					events.push({
						id: schedule.id,
						title: schedule.title,
						description: schedule.description || "",
						startTime: new Date(schedule.startTime),
						endTime: new Date(schedule.endTime),
						theme: schedule.theme,
						type: "schedule",
					});
				}
			});

			// Sort events by start time
			return events.sort((a, b) => {
				return a.startTime.getTime() - b.startTime.getTime();
			});
		};
	}, [courses, schedules, periodToTime]);

	return { getEventsForDay };
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
	if (!date1 || !date2) return false;
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

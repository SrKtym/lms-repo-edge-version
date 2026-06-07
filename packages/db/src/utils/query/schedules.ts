import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import { schedules } from "../../schema";

// スケジュール一覧を取得する関数
export async function fetchSchedules(userId: string) {
	const schedulesList = await createDb()
		.select({
			id: schedules.id,
			title: schedules.title,
			description: schedules.description,
			startTime: schedules.startTime,
			endTime: schedules.endTime,
			theme: schedules.theme,
		})
		.from(schedules)
		.where(eq(schedules.createdBy, userId));

	return schedulesList;
}

export type FetchSchedulesReturnType = Awaited<
	ReturnType<typeof fetchSchedules>
>;

// 単一のスケジュールを取得する関数
export async function fetchScheduleById(scheduleId: string) {
	const schedule = await createDb()
		.select({
			id: schedules.id,
			title: schedules.title,
			description: schedules.description,
			startTime: schedules.startTime,
			endTime: schedules.endTime,
			theme: schedules.theme,
		})
		.from(schedules)
		.where(eq(schedules.id, scheduleId));
	return schedule;
}

export type FetchScheduleByIdReturnType = Awaited<
	ReturnType<typeof fetchScheduleById>
>;

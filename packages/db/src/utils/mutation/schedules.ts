import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import { schedules } from "../../schema";
import type { Schedules, SchedulesOptional } from "../../types";

export async function createSchedules(schedulesData: Schedules) {
	try {
		await createDb().insert(schedules).values(schedulesData);
		return { message: "スケジュールの作成に成功しました。", status: 201 };
	} catch (error) {
		return { message: "スケジュールの作成に失敗しました。", status: 500 };
	}
}

export async function updateSchedules(
	schedulesData: Omit<Schedules, SchedulesOptional>,
) {
	try {
		await createDb().update(schedules).set(schedulesData);
		return { message: "スケジュールの更新に成功しました。", status: 200 };
	} catch (error) {
		return { message: "スケジュールの更新に失敗しました。", status: 500 };
	}
}

export async function deleteSchedules(scheduleId: string) {
	try {
		await createDb().delete(schedules).where(eq(schedules.id, scheduleId));
		return { message: "スケジュールの削除に成功しました。", status: 200 };
	} catch (error) {
		return { message: "スケジュールの削除に失敗しました。", status: 500 };
	}
}

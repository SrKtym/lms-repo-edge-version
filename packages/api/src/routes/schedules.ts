import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo/auth/server";
import {
	createSchedules,
	deleteSchedules,
	updateSchedules,
} from "@lms-repo/db/utils/mutation/schedules";
import {
	fetchScheduleById,
	fetchSchedules,
} from "@lms-repo/db/utils/query/schedules";
import { Hono } from "hono";
import { z } from "zod";

const formSchema = z
	.object({
		title: z
			.string()
			.transform((value) => (value === "" ? "タイトルなし" : value))
			.optional(),
		description: z.string().optional(),
		startTime: z.coerce
			.date()
			.min(new Date(), "開始日時は現在時刻以降でなければなりません。"),
		endTime: z.coerce.date(),
		theme: z
			.string()
			.regex(/^#[0-9a-f]{6}$/i, "有効なカラーコードを入力してください")
			.optional(),
	})
	.refine((value) => value.startTime < value.endTime, {
		error: "開始日時は終了日時よりも前でなければなりません。",
	});

// スケジュールに関するロジック
export const schedulesRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// スケジュール作成
	.post("/", zValidator("json", formSchema), async (c) => {
		const { userId } = c.get("session");
		const scheduleData = c.req.valid("json");
		const result = await createSchedules({
			...scheduleData,
			createdBy: userId,
		});
		return c.json(result);
	})
	// スケジュール一覧取得
	.get("/", async (c) => {
		const { userId } = c.get("session");
		const result = await fetchSchedules(userId);
		return c.json(result, 200);
	})
	// スケジュール個別取得
	.get("/:id", async (c) => {
		const scheduleId = c.req.param("id");
		const result = await fetchScheduleById(scheduleId);
		return c.json(result, 200);
	})
	// スケジュール更新
	.patch("/", zValidator("json", formSchema), async (c) => {
		const scheduleData = c.req.valid("json");
		const result = await updateSchedules(scheduleData);
		return c.json(result);
	})
	// スケジュール削除
	.delete("/", zValidator("json", z.string()), async (c) => {
		const scheduleId = c.req.valid("json");
		const result = await deleteSchedules(scheduleId);
		return c.json(result);
	});

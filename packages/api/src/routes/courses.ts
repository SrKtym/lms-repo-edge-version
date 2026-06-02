import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo/auth/server";
import type { Courses } from "@lms-repo/db/types";
import {
	checkCourse,
	createCourses,
	registerCourses,
	unregisterCourse,
} from "@lms-repo/db/utils/mutation/courses";
import {
	fetchCompletedCourses,
	fetchCourses,
	fetchRegisteredCourses,
} from "@lms-repo/db/utils/query/courses";
import { Hono } from "hono";
import { z } from "zod";

// 講義に関するロジック
export const coursesRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// 講義作成
	.post(
		"/",
		zValidator("json", z.custom<Omit<Courses, "professorId">>()),
		async (c) => {
			const { userId } = c.get("session");
			const courseData = c.req.valid("json");
			const result = await createCourses({
				...courseData,
				professorId: userId,
			});
			return c.json(result);
		},
	)
	// 講義検索
	.get("/", async (c) => {
		const { weekdays, period, limit, offset } = c.req.query();
		if (!weekdays || !period) {
			return c.json([], 200);
		}

		const result = await fetchCourses(
			Number(weekdays),
			Number(period),
			Number(limit),
			Number(offset),
		);
		return c.json(result, 200);
	})
	// 修了した講義の単位数の合計を取得
	.get("/completed", async (c) => {
		const { userId } = c.get("session");
		const result = await fetchCompletedCourses(userId);
		return c.json(result, 200);
	})
	.basePath("/registered")
	// 講義登録
	.post(
		"/",
		zValidator("json", z.object({ courseId: z.string() })),
		async (c) => {
			const { userId } = c.get("session");
			const { courseId } = c.req.valid("json");
			const result = await registerCourses(courseId, userId);
			return c.json(result);
		},
	)
	// 登録講義取得
	.get("/", async (c) => {
		const { userId } = c.get("session");
		const result = await fetchRegisteredCourses(userId);
		return c.json(result, 200);
	})
	// 登録講義の確定
	.patch("/", async (c) => {
		const { userId } = c.get("session");
		const result = await checkCourse(userId);
		return c.json(result);
	})
	// 登録講義削除
	.delete(
		"/",
		zValidator("json", z.object({ courseId: z.string() })),
		async (c) => {
			const { userId } = c.get("session");
			const { courseId } = c.req.valid("json");
			const result = await unregisterCourse(courseId, userId);
			return c.json(result);
		},
	);

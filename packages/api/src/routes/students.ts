import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo/auth/server";
import { registerStudentData } from "@lms-repo/db/utils/mutation/students";
import {
	fetchMembersByCourseId,
	fetchStudentData,
} from "@lms-repo/db/utils/query/students";
import { Hono } from "hono";
import { z } from "zod";

// 学生関連のルート
export const studentsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// 学生の所属登録
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				grade: z
					.number()
					.int("対象学年は整数で入力してください")
					.min(1, "対象学年は1から4の間で入力してください")
					.max(4, "対象学年は1から4の間で入力してください"),
				departmentName: z.string(),
			}),
		),
		async (c) => {
			const { userId } = c.get("session");
			const { grade, departmentName } = c.req.valid("json");
			const result = await registerStudentData(userId, departmentName, grade);
			return c.json(result);
		},
	)
	// 学生のデータ取得
	.get("/data", async (c) => {
		const { userId } = c.get("session");
		const result = await fetchStudentData(userId);
		return c.json(result);
	})
	// 講義を登録しているメンバーの取得
	.get("/:courseId", async (c) => {
		const { courseId } = c.req.param();
		const result = await fetchMembersByCourseId(courseId);
		return c.json(result);
	});

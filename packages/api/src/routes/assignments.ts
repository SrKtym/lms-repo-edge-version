import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo-edge-version/auth/server";
import { createAssignments } from "@lms-repo-edge-version/db/utils/mutation/assignments";
import { fetchAssignmentsFromUserCourses } from "@lms-repo-edge-version/db/utils/query/assignments";
import { resend } from "@lms-repo-edge-version/emails";
import NewAssignmentEmail from "@lms-repo-edge-version/emails/components/new-assignment-email";
import { env } from "@lms-repo-edge-version/env/server";
import { Hono } from "hono";
import { z } from "zod";

const formSchema = z.object({
	title: z.string().min(1, "課題名は必須です"),
	description: z.string(),
	points: z
		.number()
		.int("点数は整数で入力してください")
		.min(0, "点数は0以上で入力してください")
		.max(100, "点数は100以下で入力してください"),
	dueDate: z.coerce
		.date()
		.min(new Date(), "締切日は未来の日付を入力してください"),
	format: z.string().min(1, "提出形式を選択してください"),
	courseId: z.string().min(1),
});

// 課題に関するロジック
export const assignmentsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// 課題作成
	.post("/", zValidator("json", formSchema), async (c) => {
		const { userId } = c.get("session");
		const { email } = c.get("user");
		const assignmentData = c.req.valid("json");
		const result = await createAssignments(assignmentData, userId);

		if ("message" in result) {
			return c.json(result);
		}

		if (result[0]) {
			await resend.emails.send({
				from: "onboarding@resend.dev",
				to: result[0].emails,
				subject: "新しい課題",
				react: NewAssignmentEmail({
					email: email,
					assignmentTitle: result[0].title,
					assignmentDescription: result[0].description,
					dueDate: result[0].dueDate.toString(),
					viewUrl: env.CORS_ORIGIN,
				}),
			});
		}

		return c.json({ message: "課題を作成しました", status: 201 });
	})
	// 課題一覧取得
	.get("/", async (c) => {
		const { userId } = c.get("session");
		const assignments = await fetchAssignmentsFromUserCourses(userId);
		return c.json(assignments, 200);
	});

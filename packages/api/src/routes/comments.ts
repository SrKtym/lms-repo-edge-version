import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo/auth/server";
import type { Comments, CommentsOptional } from "@lms-repo/db/types";
import { createComments } from "@lms-repo/db/utils/mutation/comments";
import { fetchCommentsWithAssignment } from "@lms-repo/db/utils/query/comments";
import { Hono } from "hono";
import { z } from "zod";

export const commentsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// コメント作成
	.post(
		"/",
		zValidator("json", z.custom<Omit<Comments, CommentsOptional>>()),
		async (c) => {
			const { userId } = c.get("session");
			const comment = c.req.valid("json");
			const result = await createComments({ ...comment, createdBy: userId });
			return c.json(result);
		},
	)
	// コメント取得
	.get("/:assignmentId", async (c) => {
		const assignmentId = c.req.param("assignmentId");
		const result = await fetchCommentsWithAssignment(assignmentId);
		return c.json(result);
	});

import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import { comments, user } from "../../schema";

// 課題についてのコメントを取得
export async function fetchCommentsWithAssignment(assignmentId: string) {
	const commentList = await createDb()
		.select({
			id: comments.id,
			content: comments.content,
			createdAt: comments.createdAt,
			updatedAt: comments.updatedAt,
			avatar: user.image,
			createdBy: user.name,
		})
		.from(comments)
		.innerJoin(user, eq(comments.createdBy, user.id))
		.where(eq(comments.assignmentId, assignmentId));

	return commentList;
}

export type FetchCommentsWithAssignmentReturnType = Awaited<
	ReturnType<typeof fetchCommentsWithAssignment>
>;

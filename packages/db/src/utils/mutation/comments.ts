import { createDb } from "../../index";
import { comments } from "../../schema";
import type { Comments } from "../../types";

// コメント作成
export async function createComments(commentsData: Comments) {
	try {
		await createDb().insert(comments).values(commentsData);
		return { message: "コメントの作成に成功しました。", status: 201 };
	} catch (error) {
		return { message: "コメントの作成に失敗しました。", status: 500 };
	}
}

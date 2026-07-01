import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import {
	fileSubmissionsMetadata,
	submissionStatus,
	textSubmissions,
} from "../../schema/service";
import type { FileSubmissionsMetadata, TextSubmissions } from "../../types";

// テキスト形式の提出
export const createTextSubmission = async (submission: TextSubmissions) => {
	try {
		await createDb().insert(textSubmissions).values(submission);
		return { message: "テキスト提出に成功しました", status: 200 };
	} catch {
		return { message: "テキスト提出に失敗しました", status: 500 };
	}
};

// ファイル形式の提出メタデータ作成
export const createFileSubmissionMetadata = async (
	submissionMetadata: FileSubmissionsMetadata,
) => {
	try {
		const [result] = await createDb()
			.insert(fileSubmissionsMetadata)
			.values(submissionMetadata)
			.returning({
				bucket: fileSubmissionsMetadata.bucket,
				objectName: fileSubmissionsMetadata.objectName,
				originalName: fileSubmissionsMetadata.originalName,
				mimeType: fileSubmissionsMetadata.mimeType,
				fileSize: fileSubmissionsMetadata.fileSize,
			});
		return result;
	} catch {
		return { message: "ファイルメタデータの作成に失敗しました", status: 500 };
	}
};

// 提出状況の更新
export const updateSubmissionStatus = async (
	assignmentId: string,
	userId: string,
	status: "未提出" | "提出済み" | "評定済み",
) => {
	try {
		await createDb()
			.insert(submissionStatus)
			.values({
				assignmentId,
				userId,
				status,
			})
			.onConflictDoUpdate({
				target: [submissionStatus.assignmentId, submissionStatus.userId],
				set: { status },
			});
		return { message: "提出状況の更新に成功しました", status: 200 };
	} catch {
		return { message: "提出状況の更新に失敗しました", status: 500 };
	}
};

// ファイルメタデータの削除
export const deleteFileSubmissionMetadata = async (fileId: string) => {
	try {
		await createDb()
			.delete(fileSubmissionsMetadata)
			.where(eq(fileSubmissionsMetadata.id, fileId));
		return { message: "ファイルメタデータの削除に成功しました", status: 200 };
	} catch {
		return { message: "ファイルメタデータの削除に失敗しました", status: 500 };
	}
};

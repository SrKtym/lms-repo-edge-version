import { createDb } from "../../index";
import { fileSubmissionsMetadata, textSubmissions } from "../../schema/service";
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

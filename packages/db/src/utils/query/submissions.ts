import { and, eq } from "drizzle-orm";
import { createDb } from "../../index";
import {
	assignments,
	fileSubmissionsMetadata,
	registration,
	submissionStatus,
} from "../../schema";

// ユーザーが登録している講義の課題提出状況を取得
export async function fetchSubmissionsFromUserCourses(userId: string) {
	const submissionList = await createDb()
		.select({
			status: submissionStatus.status,
			score: submissionStatus.score,
			assignmentTitle: assignments.title,
		})
		.from(submissionStatus)
		.innerJoin(assignments, eq(submissionStatus.assignmentId, assignments.id))
		.innerJoin(registration, eq(assignments.courseId, registration.courseId))
		.where(eq(registration.userId, userId));

	return submissionList;
}

export type FetchSubmissionsFromUserCoursesReturnType = Awaited<
	ReturnType<typeof fetchSubmissionsFromUserCourses>
>;

// ユーザーが登録している講義の特定の課題の提出状況を取得
export async function fetchSubmissionById(
	userId: string,
	assignmentId: string,
) {
	const submission = await createDb()
		.select({
			status: submissionStatus.status,
			score: submissionStatus.score,
			assignmentTitle: assignments.title,
		})
		.from(submissionStatus)
		.innerJoin(assignments, eq(submissionStatus.assignmentId, assignments.id))
		.innerJoin(registration, eq(assignments.courseId, registration.courseId))
		.where(
			and(eq(registration.userId, userId), eq(assignments.id, assignmentId)),
		)
		.limit(1);

	return submission;
}

export type FetchSubmissionByIdReturnType = Awaited<
	ReturnType<typeof fetchSubmissionById>
>;

// ユーザーのファイル提出メタデータを取得
export async function fetchFileSubmissionsByUser(userId: string) {
	const files = await createDb()
		.select({
			id: fileSubmissionsMetadata.id,
			bucket: fileSubmissionsMetadata.bucket,
			objectName: fileSubmissionsMetadata.objectName,
			originalName: fileSubmissionsMetadata.originalName,
			mimeType: fileSubmissionsMetadata.mimeType,
			fileSize: fileSubmissionsMetadata.fileSize,
			createdAt: fileSubmissionsMetadata.createdAt,
		})
		.from(fileSubmissionsMetadata)
		.where(eq(fileSubmissionsMetadata.createdBy, userId));

	return files;
}

export type FetchFileSubmissionsByUserReturnType = Awaited<
	ReturnType<typeof fetchFileSubmissionsByUser>
>;

// ファイルIDでファイルメタデータを取得
export async function fetchFileSubmissionById(fileId: string) {
	const [file] = await createDb()
		.select({
			objectName: fileSubmissionsMetadata.objectName,
			bucket: fileSubmissionsMetadata.bucket,
		})
		.from(fileSubmissionsMetadata)
		.where(eq(fileSubmissionsMetadata.id, fileId))
		.limit(1);

	return file;
}

export type FetchFileSubmissionByIdReturnType = Awaited<
	ReturnType<typeof fetchFileSubmissionById>
>;

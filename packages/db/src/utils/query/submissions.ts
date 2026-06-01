import { and, eq } from "drizzle-orm";
import { createDb } from "../../index";
import { assignments, registration, submissionStatus } from "../../schema";

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

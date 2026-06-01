import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import { assignments, courses, registration } from "../../schema";

// ユーザーが登録している講義の担当教員からの課題を取得
export async function fetchAssignmentsFromUserCourses(userId: string) {
	const assignmentsList = await createDb()
		.select({
			id: assignments.id,
			title: assignments.title,
			description: assignments.description,
			points: assignments.points,
			dueDate: assignments.dueDate,
			format: assignments.format,
			courseId: courses.id,
			courseName: courses.name,
		})
		.from(assignments)
		.innerJoin(courses, eq(assignments.courseId, courses.id))
		.innerJoin(registration, eq(courses.id, registration.courseId))
		.where(eq(registration.userId, userId));

	return assignmentsList;
}

export type FetchAssignmentsFromUserCoursesReturnType = Awaited<
	ReturnType<typeof fetchAssignmentsFromUserCourses>
>;

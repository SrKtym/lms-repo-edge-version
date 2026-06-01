import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import { announcements, courses, registration } from "../../schema";

// ユーザーが登録している講義の担当教員からのお知らせを取得
export async function fetchAnnouncementsFromUserCourses(userId: string) {
	const announcementsList = await createDb()
		.select({
			id: announcements.id,
			title: announcements.title,
			description: announcements.description,
			type: announcements.type,
			createdAt: announcements.createdAt,
			updatedAt: announcements.updatedAt,
			courseId: courses.id,
			courseName: courses.name,
		})
		.from(announcements)
		.innerJoin(courses, eq(announcements.courseId, courses.id))
		.innerJoin(registration, eq(courses.id, registration.courseId))
		.where(eq(registration.userId, userId));

	return announcementsList;
}

export type FetchAnnouncementsFromUserCoursesReturnType = Awaited<
	ReturnType<typeof fetchAnnouncementsFromUserCourses>
>;

// IDからお知らせを取得
// export async function fetchAnnouncementById(announcementId: string) {
// 	const announcement = await createDb()
// 		.select({
// 			id: announcements.id,
// 			title: announcements.title,
// 			description: announcements.description,
// 			type: announcements.type,
// 			createdAt: announcements.createdAt,
// 			updatedAt: announcements.updatedAt,
// 		})
// 		.from(announcements)
// 		.where(eq(announcements.id, announcementId));
// 	return announcement;
// }

import { eq, inArray } from "drizzle-orm";
import { createDb } from "../../index";
import {
	courses,
	departments,
	faculties,
	notifications,
	registration,
} from "../../schema";

// 通知の取得
export async function fetchNotifications(userId: string) {
	const notificationList = await createDb().transaction(async (tx) => {
		const ids = await tx
			.select({
				courseId: courses.id,
				departmentId: departments.id,
				facultyId: faculties.id,
			})
			.from(courses)
			.innerJoin(registration, eq(courses.id, registration.courseId))
			.innerJoin(departments, eq(courses.departmentId, departments.id))
			.innerJoin(faculties, eq(departments.facultyId, faculties.id))
			.where(eq(registration.userId, userId));

		const idList = ids.flatMap(({ courseId, departmentId, facultyId }) => [
			courseId,
			departmentId,
			facultyId,
		]);

		const notificationsList = await tx
			.select()
			.from(notifications)
			.where(inArray(notifications.receiver, [...idList, "students"]));

		return notificationsList;
	});

	return notificationList;
}

export type FetchNotificationsReturnType = Awaited<
	ReturnType<typeof fetchNotifications>
>;

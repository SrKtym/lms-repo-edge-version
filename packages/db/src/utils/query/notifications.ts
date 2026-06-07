import { and, eq, inArray, or } from "drizzle-orm";
import { createDb } from "../../index";
import {
	courses,
	departments,
	faculties,
	notifications,
	registration,
} from "../../schema";

// 通知の総数を取得(サブクエリを使用)
export async function fetchNotificationsCount(
	userId: string,
	filter?: "all" | "unread" | "read",
) {
	const baseConditions = [
		eq(notifications.receiver, "students"),
		inArray(
			notifications.receiver,
			createDb()
				.select({ id: courses.id })
				.from(courses)
				.innerJoin(registration, eq(courses.id, registration.courseId))
				.where(eq(registration.userId, userId)),
		),
		inArray(
			notifications.receiver,
			createDb()
				.select({ id: departments.id })
				.from(departments)
				.innerJoin(courses, eq(departments.id, courses.departmentId))
				.innerJoin(registration, eq(courses.id, registration.courseId))
				.where(eq(registration.userId, userId)),
		),
		inArray(
			notifications.receiver,
			createDb()
				.select({ id: faculties.id })
				.from(faculties)
				.innerJoin(departments, eq(faculties.id, departments.facultyId))
				.innerJoin(courses, eq(departments.id, courses.departmentId))
				.innerJoin(registration, eq(courses.id, registration.courseId))
				.where(eq(registration.userId, userId)),
		),
	];

	let conditions = baseConditions;

	if (filter === "unread") {
		conditions = [...baseConditions, eq(notifications.isRead, false)];
	} else if (filter === "read") {
		conditions = [...baseConditions, eq(notifications.isRead, true)];
	}

	const count = await createDb()
		.select({ count: notifications.id })
		.from(notifications)
		.where(
			and(or(...baseConditions), ...conditions.slice(baseConditions.length)),
		);

	return count.length;
}

// 通知の取得（サブクエリを使用）
export async function fetchNotifications(
	userId: string,
	limit = 10,
	offset = 0,
) {
	const notificationList = await createDb()
		.select()
		.from(notifications)
		.where(
			or(
				eq(notifications.receiver, "students"),
				inArray(
					notifications.receiver,
					createDb()
						.select({ id: courses.id })
						.from(courses)
						.innerJoin(registration, eq(courses.id, registration.courseId))
						.where(eq(registration.userId, userId)),
				),
				inArray(
					notifications.receiver,
					createDb()
						.select({ id: departments.id })
						.from(departments)
						.innerJoin(courses, eq(departments.id, courses.departmentId))
						.innerJoin(registration, eq(courses.id, registration.courseId))
						.where(eq(registration.userId, userId)),
				),
				inArray(
					notifications.receiver,
					createDb()
						.select({ id: faculties.id })
						.from(faculties)
						.innerJoin(departments, eq(faculties.id, departments.facultyId))
						.innerJoin(courses, eq(departments.id, courses.departmentId))
						.innerJoin(registration, eq(courses.id, registration.courseId))
						.where(eq(registration.userId, userId)),
				),
			),
		)
		.limit(limit)
		.offset(offset);

	return notificationList;
}

export type FetchNotificationsReturnType = Awaited<
	ReturnType<typeof fetchNotifications>
>;

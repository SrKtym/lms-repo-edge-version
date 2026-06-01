import { client } from "../lib/hono-client";

// 曜日と時限から講義を取得するqueryFn
export const fetchCoursesByWeekdayAndPeriodQueryFn = async (
	weekdays?: number,
	period?: number,
	limit?: number,
	offset?: number,
) => {
	if (!weekdays || !period) {
		return [];
	}

	const queryParams: Record<string, string> = {};

	if (limit !== undefined) {
		queryParams.limit = limit.toString();
	}
	if (offset !== undefined) {
		queryParams.offset = offset.toString();
	}

	const res = await client.api.courses.$get({
		query: { weekdays, period, ...queryParams },
	});
	const data = await res.json();
	return data;
};

// 登録済み講義取得用のqueryFn
export const fetchRegisteredCoursesQueryFn = async () => {
	const res = await client.api.courses.registered.$get();
	const data = await res.json();
	if ("message" in data) {
		return [];
	}
	return data;
};

// 修了済み講義の総単位数取得用のqueryFn
export const fetchCompletedCoursesQueryFn = async () => {
	const res = await client.api.courses.completed.$get();
	const data = await res.json();
	return data;
};

// スケジュール取得用のqueryFn
export const fetchSchedulesQueryFn = async () => {
	const res = await client.api.schedules.$get();
	const data = await res.json();
	const parsedData = data.map((schedule) => ({
		...schedule,
		startTime: new Date(schedule.startTime),
		endTime: new Date(schedule.endTime),
	}));
	return parsedData;
};

// お知らせ取得用のqueryFn
export const fetchAnnouncementsQueryFn = async () => {
	const res = await client.api.announcements.$get();
	const data = await res.json();
	const parsedData = data.map((announcement) => ({
		...announcement,
		createdAt: new Date(announcement.createdAt),
		updatedAt: new Date(announcement.updatedAt),
	}));
	return parsedData;
};

// 課題取得用のqueryFn
export const fetchAssignmentsQueryFn = async () => {
	const res = await client.api.assignments.$get();
	const data = await res.json();
	const parsedData = data.map((assignment) => ({
		...assignment,
		dueDate: new Date(assignment.dueDate),
	}));
	return parsedData;
};

// 課題提出状況取得用のqueryFn
export const fetchSubmissionsQueryFn = async () => {
	const res = await client.api.submissions.$get();
	const data = await res.json();
	return data;
};

// 特定の課題提出状況取得用のqueryFn
export const fetchSubmissionByIdQueryFn = async (assignmentId?: string) => {
	if (!assignmentId) {
		return [];
	}
	const res = await client.api.submissions[":assignmentId"].$get({
		param: { assignmentId },
	});
	const data = await res.json();
	return data;
};

// 通知取得用のqueryFn
export const fetchNotificationsQueryFn = async () => {
	const res = await client.api.notifications.$get();
	const data = await res.json();
	const parsedData = data.map((notification) => ({
		...notification,
		createdAt: new Date(notification.createdAt),
	}));
	return parsedData;
};

// 学生データ取得用のqueryFn
export const fetchStudentDataQueryFn = async () => {
	const res = await client.api.students.data.$get();
	const data = await res.json();
	return data;
};

// 講義を登録しているメンバー取得用のqueryFn
export const fetchMembersByCourseIdQueryFn = async (courseId: string) => {
	const res = await client.api.students[":courseId"].$get({
		param: { courseId },
	});
	const data = await res.json();
	return data;
};

// コメント取得用のqueryFn
export const fetchCommentsWithAssignmentQueryFn = async (
	assignmentId: string,
) => {
	const res = await client.api.comments[":assignmentId"].$get({
		param: { assignmentId },
	});
	const data = await res.json();
	const parsedData = data.map((comment) => ({
		...comment,
		createdAt: new Date(comment.createdAt),
		updatedAt: new Date(comment.updatedAt),
	}));
	return parsedData;
};

// メール通知設定取得用のqueryFn
export const fetchEmailNotificationSettingsQueryFn = async () => {
	const res = await client.api.settings.email_notification.$get();
	const data = await res.json();
	return data;
};

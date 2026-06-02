import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	foreignKey,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const requirements = ["必修", "選択必修", "任意"] as const;
export const requirementsEnum = pgEnum("requirements", requirements);
export const assignmentFormat = [
	"text",
	"pdf",
	"excel",
	"word",
	"powerpoint",
] as const;
export const announcementType = ["資料", "アンケート", "その他"] as const;
const statusList = ["未提出", "提出済み", "評定済み"] as const;

// 学生テーブル
export const students = pgTable(
	"students",
	{
		id: text("id")
			.primaryKey()
			.references(() => user.id, { onDelete: "cascade" }),
		grade: integer("grade").notNull(),
		departmentId: text("department_id")
			.notNull()
			.references(() => departments.id, { onDelete: "cascade" }),
	},
	(t) => [
		index("students_department_id_idx").on(t.departmentId),
		check("grade_range", sql`${t.grade} >= 1 AND ${t.grade} <= 4`),
	],
);

// 教授テーブル
export const professors = pgTable(
	"professors",
	{
		id: text("id")
			.primaryKey()
			.references(() => user.id, { onDelete: "cascade" }),
		departmentId: text("department_id")
			.notNull()
			.references(() => departments.id, { onDelete: "cascade" }),
	},
	(t) => [index("professors_department_id_idx").on(t.departmentId)],
);

// 学部テーブル
export const faculties = pgTable("faculties", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").unique().notNull(),
});

// 学科テーブル
export const departments = pgTable(
	"departments",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text("name").unique().notNull(),
		facultyId: text("faculty_id")
			.notNull()
			.references(() => faculties.id, { onDelete: "cascade" }),
		requiredCredits: integer("required_credits").notNull(),
	},
	(t) => [
		index("departments_faculty_id_idx").on(t.facultyId),
		check(
			"required_credits_range",
			sql`${t.requiredCredits} >= 130 AND ${t.requiredCredits} <= 200`,
		),
	],
);

// 講義テーブル
export const courses = pgTable(
	"courses",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text("name").notNull(),
		targetGrade: integer("target_grade").notNull(),
		weekdays: integer("weekdays").notNull(),
		period: integer("period").notNull(),
		credits: integer("credits").notNull(),
		requirements: requirementsEnum("requirements").notNull().default("任意"),
		classRoom: text("class_room").notNull(),
		departmentId: text("department_id")
			.notNull()
			.references(() => departments.id, { onDelete: "cascade" }),
		professorId: text("professor_id")
			.notNull()
			.references(() => professors.id, { onDelete: "cascade" }),
	},
	(t) => [
		index("courses_department_id_idx").on(t.departmentId),
		index("courses_professor_id_idx").on(t.professorId),
		index("courses_weekdays_period_idx").on(t.weekdays, t.period),
		check(
			"target_grade_range",
			sql`${t.targetGrade} >= 1 AND ${t.targetGrade} <= 4`,
		),
		check("weekdays_range", sql`${t.weekdays} >= 1 AND ${t.weekdays} <= 5`),
		check("period_range", sql`${t.period} >= 1 AND ${t.period} <= 5`),
		check("credits_range", sql`${t.credits} >= 1 AND ${t.credits} <= 4`),
	],
);

// 履修登録テーブル（関連エンティティ）
export const registration = pgTable(
	"registration",
	{
		userId: text("user_id").notNull(),
		courseId: text("course_id").notNull(),
		isChecked: boolean("is_checked").notNull().default(false),
		isCompleted: boolean("is_completed").notNull().default(false),
	},
	(t) => [
		index("registration_user_id_course_id_idx").on(t.userId, t.courseId),
		primaryKey({ columns: [t.userId, t.courseId] }),
		foreignKey({
			columns: [t.courseId],
			foreignColumns: [courses.id],
		}).onDelete("cascade"),
		foreignKey({
			columns: [t.userId],
			foreignColumns: [user.id],
		}).onDelete("cascade"),
	],
);

// お知らせテーブル
export const announcements = pgTable(
	"announcements",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		title: text("title").notNull(),
		description: text("description").notNull(),
		type: text("type").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		courseId: text("course_id")
			.notNull()
			.references(() => courses.id, { onDelete: "cascade" }),
	},
	(t) => [
		index("announcements_course_id_idx").on(t.courseId),
		check(
			"type_check",
			sql`${t.type} IN (${sql.raw(
				[...announcementType].map((t) => `'${t}'`).join(", "),
			)})`,
		),
	],
);

// スケジュールテーブル
export const schedules = pgTable(
	"schedules",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		title: text("title").notNull().default("タイトルなし"),
		description: text("description").notNull().default(""),
		startTime: timestamp("start_time", {
			mode: "date",
			precision: 0,
		}).notNull(),
		endTime: timestamp("end_time", { mode: "date", precision: 0 }).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		theme: text("theme").notNull().default("#059669"),
		createdBy: text("created_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(t) => [index("schedules_created_by_idx").on(t.createdBy)],
);

// 課題テーブル
export const assignments = pgTable(
	"assignments",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		title: text("title").notNull(),
		description: text("description").notNull(),
		points: integer("points").notNull(),
		dueDate: timestamp("due_date", { mode: "date", precision: 0 }).notNull(),
		format: text("format").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		courseId: text("course_id")
			.notNull()
			.references(() => courses.id),
	},
	(t) => [
		index("assignments_course_id_idx").on(t.courseId),
		check("points_range", sql`${t.points} >= 0 AND ${t.points} <= 100`),
		check(
			"format_check",
			sql`${t.format} IN (${sql.raw([...assignmentFormat].map((f) => `'${f}'`).join(","))})`,
		),
	],
);

// テキスト形式の提出物
export const textSubmissions = pgTable(
	"text_submissions",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		title: text("title").notNull(),
		description: text("description").notNull().default(""),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		createdBy: text("created_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(t) => [index("text_submissions_created_by_idx").on(t.createdBy)],
);

// ファイル形式の提出物メタデータ
export const fileSubmissionsMetadata = pgTable(
	"file_submissions_metadata",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		bucket: text("bucket").notNull(),
		objectName: text("object_name").notNull(),
		originalName: text("original_name").notNull(),
		mimeType: text("mime_type").notNull(),
		fileSize: integer("file_size").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		createdBy: text("created_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(t) => [index("file_submissions_metadata_created_by_idx").on(t.createdBy)],
);

// 提出状況テーブル
export const submissionStatus = pgTable(
	"submission_status",
	{
		userId: text("user_id").notNull(),
		assignmentId: text("assignment_id").notNull(),
		status: text("status").notNull().default("未提出"),
		score: integer("score"),
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.assignmentId] }),
		foreignKey({
			columns: [t.userId],
			foreignColumns: [user.id],
		}).onDelete("cascade"),
		foreignKey({
			columns: [t.assignmentId],
			foreignColumns: [assignments.id],
		}).onDelete("cascade"),
		check(
			"status_check",
			sql`${t.status} IN (${sql.raw([...statusList].map((s) => `'${s}'`).join(","))})`,
		),
		check(
			"score_range",
			sql`
				CASE 
					WHEN ${t.status} IN ('未提出', '提出済み') THEN ${t.score} IS NULL
					WHEN ${t.status} = '評定済み' THEN ${t.score} >= 0 AND ${t.score} <= 100
				END
			`,
		),
	],
);

// 通知テーブル
export const notifications = pgTable(
	"notifications",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		title: text("title").notNull(),
		description: text("description").notNull(),
		sender: text("sender").notNull(),
		receiver: text("receiver").notNull(),
		isRead: boolean("is_read").default(false).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => [
		index("notifications_sender_idx").on(t.sender),
		index("notifications_receiver_is_read_idx").on(t.receiver, t.isRead),
	],
);

// メール通知設定テーブル
export const emailNotificationSettings = pgTable(
	"email_notification_settings",
	{
		userId: text("user_id")
			.primaryKey()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		announcementsEmail: boolean("announcements_email").default(false).notNull(),
		assignmentsEmail: boolean("assignments_email").default(false).notNull(),
		submissionsEmail: boolean("submissions_email").default(false).notNull(),
		evaluationsEmail: boolean("evaluations_email").default(false).notNull(),
		remindersEmail: boolean("reminders_email").default(false).notNull(),
	},
);

// コメントテーブル
export const comments = pgTable(
	"comments",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		content: text("content").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		createdBy: text("created_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		assignmentId: text("assignment_id")
			.notNull()
			.references(() => assignments.id, { onDelete: "cascade" }),
	},
	(t) => [
		index("comments_created_by_idx").on(t.createdBy),
		index("comments_assignment_id_idx").on(t.assignmentId),
	],
);

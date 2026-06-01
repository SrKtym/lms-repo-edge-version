import type {
	announcements,
	assignments,
	comments,
	courses,
	emailNotificationSettings,
	fileSubmissionsMetadata,
	notifications,
	registration,
	schedules,
	textSubmissions,
} from "@lms-repo-edge-version/db/schema/service";
import type { user } from "./schema/auth";

// データ挿入時の型
export type User = typeof user.$inferInsert;
export type Courses = typeof courses.$inferInsert;
export type Announcements = typeof announcements.$inferInsert;
export type Assignments = typeof assignments.$inferInsert;
export type Comments = typeof comments.$inferInsert;
export type Notifications = typeof notifications.$inferInsert;
export type Schedules = typeof schedules.$inferInsert;
export type Registration = typeof registration.$inferInsert;
export type EmailNotificationSettings =
	typeof emailNotificationSettings.$inferInsert;
export type TextSubmissions = typeof textSubmissions.$inferInsert;
export type FileSubmissionsMetadata =
	typeof fileSubmissionsMetadata.$inferInsert;

// データ挿入時のオプショナルフィールド
export type CoursesOptional = "id" | "departmentId" | "professorId";
export type SchedulesOptional = "id" | "createdBy" | "createdAt" | "updatedAt";
export type AnnouncementsOptional = "id" | "createdAt" | "updatedAt";
export type AssignmentsOptional = "id" | "courseId" | "createdAt" | "updatedAt";
export type UserOptional = "id";
export type CommentsOptional = "id" | "createdBy";

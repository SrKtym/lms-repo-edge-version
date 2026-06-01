CREATE SCHEMA "better_auth";
--> statement-breakpoint
CREATE TYPE "public"."requirements" AS ENUM('必修', '選択必修', '任意');--> statement-breakpoint
CREATE TABLE "better_auth"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "better_auth"."passkey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"aaguid" text
);
--> statement-breakpoint
CREATE TABLE "better_auth"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "better_auth"."two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"verified" boolean NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "better_auth"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text,
	"display_username" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"two_factor_enabled" boolean,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "better_auth"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"course_id" text NOT NULL,
	CONSTRAINT "type_check" CHECK ("announcements"."type" IN ('資料', 'アンケート', 'その他'))
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"points" integer NOT NULL,
	"due_date" timestamp (0) NOT NULL,
	"format" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"course_id" text NOT NULL,
	CONSTRAINT "points_range" CHECK ("assignments"."points" >= 0 AND "assignments"."points" <= 100),
	CONSTRAINT "format_check" CHECK ("assignments"."format" IN ('text','pdf','excel','word','powerpoint'))
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	"assignment_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"target_grade" integer NOT NULL,
	"weekdays" integer NOT NULL,
	"period" integer NOT NULL,
	"credits" integer NOT NULL,
	"requirements" "requirements" NOT NULL,
	"class_room" text NOT NULL,
	"department_id" text NOT NULL,
	"professor_id" text NOT NULL,
	CONSTRAINT "target_grade_range" CHECK ("courses"."target_grade" >= 1 AND "courses"."target_grade" <= 4),
	CONSTRAINT "weekdays_range" CHECK ("courses"."weekdays" >= 1 AND "courses"."weekdays" <= 5),
	CONSTRAINT "period_range" CHECK ("courses"."period" >= 1 AND "courses"."period" <= 5),
	CONSTRAINT "credits_range" CHECK ("courses"."credits" >= 1 AND "courses"."credits" <= 4)
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"faculty_id" text NOT NULL,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "email_notification_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"announcements_email" boolean DEFAULT false NOT NULL,
	"assignments_email" boolean DEFAULT false NOT NULL,
	"submissions_email" boolean DEFAULT false NOT NULL,
	"evaluations_email" boolean DEFAULT false NOT NULL,
	"reminders_email" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faculties" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "faculties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "file_submissions_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"bucket" text NOT NULL,
	"object_name" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"sender" text NOT NULL,
	"receiver" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professors" (
	"id" text PRIMARY KEY NOT NULL,
	"department_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registration" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"is_checked" boolean DEFAULT false NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'タイトルなし' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"start_time" timestamp (0) NOT NULL,
	"end_time" timestamp (0) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"theme" text DEFAULT '#059669' NOT NULL,
	"created_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"grade" integer NOT NULL,
	"department_id" text NOT NULL,
	"department_name" text NOT NULL,
	"required_credits" integer NOT NULL,
	CONSTRAINT "grade_range" CHECK ("students"."grade" >= 1 AND "students"."grade" <= 4),
	CONSTRAINT "required_credits_by_department" CHECK (
				CASE
					WHEN "students"."department_name" = '医学科' THEN "students"."required_credits" = 200
					WHEN "students"."department_name" IN ('看護学科', '保健学科') THEN "students"."required_credits" = 140
					ELSE "students"."required_credits" = 130
				END
			)
);
--> statement-breakpoint
CREATE TABLE "submission_status" (
	"user_id" text NOT NULL,
	"assignment_id" text NOT NULL,
	"status" text DEFAULT '未提出' NOT NULL,
	"score" integer,
	CONSTRAINT "submission_status_user_id_assignment_id_pk" PRIMARY KEY("user_id","assignment_id"),
	CONSTRAINT "status_check" CHECK ("submission_status"."status" IN ('未提出','提出済み','評定済み')),
	CONSTRAINT "score_range" CHECK (
				CASE 
					WHEN "submission_status"."status" IN ('未提出', '提出済み') THEN "submission_status"."score" IS NULL
					WHEN "submission_status"."status" = '評定済み' THEN "submission_status"."score" >= 0 AND "submission_status"."score" <= 100
				END
			)
);
--> statement-breakpoint
CREATE TABLE "text_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "better_auth"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "better_auth"."passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "better_auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "better_auth"."two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_professor_id_professors_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_notification_settings" ADD CONSTRAINT "email_notification_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_submissions_metadata" ADD CONSTRAINT "file_submissions_metadata_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professors" ADD CONSTRAINT "professors_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professors" ADD CONSTRAINT "professors_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration" ADD CONSTRAINT "registration_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_status" ADD CONSTRAINT "submission_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_status" ADD CONSTRAINT "submission_status_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_submissions" ADD CONSTRAINT "text_submissions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "better_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "better_auth"."account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "better_auth"."session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "better_auth"."verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "announcements_course_id_idx" ON "announcements" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "assignments_course_id_idx" ON "assignments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "comments_created_by_idx" ON "comments" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "courses_department_id_idx" ON "courses" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "courses_professor_id_idx" ON "courses" USING btree ("professor_id");--> statement-breakpoint
CREATE INDEX "courses_weekdays_period_idx" ON "courses" USING btree ("weekdays","period");--> statement-breakpoint
CREATE INDEX "departments_faculty_id_idx" ON "departments" USING btree ("faculty_id");--> statement-breakpoint
CREATE INDEX "email_notification_settings_user_id_idx" ON "email_notification_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "file_submissions_metadata_created_by_idx" ON "file_submissions_metadata" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "notifications_receiver_is_read_idx" ON "notifications" USING btree ("receiver","is_read");--> statement-breakpoint
CREATE INDEX "professors_department_id_idx" ON "professors" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "schedules_created_by_idx" ON "schedules" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "students_department_id_idx" ON "students" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "text_submissions_created_by_idx" ON "text_submissions" USING btree ("created_by");
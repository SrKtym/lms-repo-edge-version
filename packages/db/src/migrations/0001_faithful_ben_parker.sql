ALTER TABLE "students" DROP CONSTRAINT "required_credits_by_department";--> statement-breakpoint
DROP INDEX "email_notification_settings_user_id_idx";--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "required_credits" integer NOT NULL;--> statement-breakpoint
CREATE INDEX "comments_assignment_id_idx" ON "comments" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "notifications_sender_idx" ON "notifications" USING btree ("sender");--> statement-breakpoint
CREATE INDEX "registration_user_id_course_id_idx" ON "registration" USING btree ("user_id","course_id");--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "department_name";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "required_credits";--> statement-breakpoint
ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_course_id_unique" UNIQUE("user_id","course_id");--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "required_credits_range" CHECK ("departments"."required_credits" >= 100 AND "departments"."required_credits" <= 200);
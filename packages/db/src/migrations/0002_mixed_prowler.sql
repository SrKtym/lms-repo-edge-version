ALTER TABLE "registration" DROP CONSTRAINT "registration_user_id_course_id_unique";--> statement-breakpoint
ALTER TABLE "departments" DROP CONSTRAINT "required_credits_range";--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "requirements" SET DEFAULT '任意';--> statement-breakpoint
ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_course_id_pk" PRIMARY KEY("user_id","course_id");--> statement-breakpoint
ALTER TABLE "registration" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "required_credits_range" CHECK ("departments"."required_credits" >= 130 AND "departments"."required_credits" <= 200);
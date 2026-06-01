import { eq } from "drizzle-orm";
import { createDb } from "../../index";
import { emailNotificationSettings } from "../../schema";

// メール通知設定を取得
export async function fetchEmailNotificationSettings(userId: string) {
	const settings = await createDb()
		.select({
			announcementsEmail: emailNotificationSettings.announcementsEmail,
			assignmentsEmail: emailNotificationSettings.assignmentsEmail,
			submissionsEmail: emailNotificationSettings.submissionsEmail,
			evaluationsEmail: emailNotificationSettings.evaluationsEmail,
			remindersEmail: emailNotificationSettings.remindersEmail,
		})
		.from(emailNotificationSettings)
		.where(eq(emailNotificationSettings.userId, userId))
		.limit(1);

	return settings;
}

export type FetchEmailNotificationSettings = Awaited<
	ReturnType<typeof fetchEmailNotificationSettings>
>;

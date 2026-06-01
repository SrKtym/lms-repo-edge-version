import { createDb } from "../../index";
import { emailNotificationSettings } from "../../schema";
import type { EmailNotificationSettings } from "../../types";

// メール通知設定の更新
export async function updateEmailNotificationSettings(
	settings: EmailNotificationSettings,
) {
	try {
		await createDb()
			.insert(emailNotificationSettings)
			.values(settings)
			.onConflictDoUpdate({
				target: emailNotificationSettings.userId,
				set: {
					announcementsEmail: settings.announcementsEmail,
					assignmentsEmail: settings.assignmentsEmail,
					submissionsEmail: settings.submissionsEmail,
					evaluationsEmail: settings.evaluationsEmail,
					remindersEmail: settings.remindersEmail,
				},
			});
		return { message: "メール通知設定を更新しました。", status: 200 };
	} catch (error) {
		return { message: "メール通知設定の更新に失敗しました。", status: 500 };
	}
}

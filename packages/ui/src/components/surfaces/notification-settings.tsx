import { Surface } from "@heroui/react";
import type { EmailNotificationSettings } from "@lms-repo-edge-version/db/types";
import type { FetchEmailNotificationSettings } from "@lms-repo-edge-version/db/utils/query/settings";
import { useState } from "react";
import { EmailNotificationSwitch } from "../switch";

interface NotificationSettingsProps {
	initialSettings: FetchEmailNotificationSettings;
	onSettingsChange: (
		settings: Omit<EmailNotificationSettings, "userId">,
	) => void;
}

export function NotificationSettings({
	initialSettings,
	onSettingsChange,
}: NotificationSettingsProps) {
	const settings = initialSettings[0] ?? {
		announcementsEmail: false,
		assignmentsEmail: false,
		submissionsEmail: false,
		evaluationsEmail: false,
		remindersEmail: false,
	};
	const [currentSettings, setCurrentSettings] =
		useState<FetchEmailNotificationSettings[number]>(settings);

	type EmailNotificationType = keyof typeof currentSettings;

	const updateSettings = (newSettings: Partial<typeof currentSettings>) => {
		const updated = { ...currentSettings, ...newSettings };
		setCurrentSettings(updated);
		onSettingsChange?.(updated);
	};

	const toggleEmailNotification = (type: EmailNotificationType) => {
		updateSettings({
			[type]: !currentSettings[type],
		});
	};

	return (
		<Surface className="mx-auto w-full max-w-2xl rounded-2xl p-6 shadow-surface">
			<h2 className="mb-6 font-bold text-foreground text-xl">通知設定</h2>

			<div className="space-y-6">
				{/* メール通知 */}
				<div>
					<h3 className="mb-4 font-medium text-foreground">メール通知</h3>
					<div className="space-y-3">
						{Object.entries(currentSettings).map(([key, value]) => (
							<div
								key={key}
								className="flex items-center justify-between rounded-lg border border-divider p-3"
							>
								<span className="text-sm">
									{key === "announcementsEmail" && "お知らせの投稿・更新"}
									{key === "assignmentsEmail" && "課題の投稿・更新"}
									{key === "submissionsEmail" && "課題の提出"}
									{key === "evaluationsEmail" && "成績・評価"}
									{key === "remindersEmail" && "締切リマインダー"}
								</span>
								<EmailNotificationSwitch
									isSelected={value}
									onChange={() => {
										toggleEmailNotification(key as EmailNotificationType);
									}}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</Surface>
	);
}

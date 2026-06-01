import { Button, Text } from "@react-email/components";
import { BaseEmailTemplate } from "./base-email-template";

export default function NewAnnouncementEmail({
	email,
	announcementTitle,
	announcementContent,
	viewUrl,
}: {
	email: string;
	announcementTitle: string;
	announcementContent: string;
	viewUrl: string;
}) {
	return (
		<BaseEmailTemplate
			preview="新しいお知らせが投稿されました"
			title="新しいお知らせ"
			email={email}
		>
			<Text className="text-base text-gray-700 leading-relaxed">
				新しいお知らせが投稿されました。
			</Text>
			<Text className="mt-4 font-bold text-gray-900 text-lg">
				{announcementTitle}
			</Text>
			<Text className="mt-2 whitespace-pre-line text-base text-gray-700 leading-relaxed">
				{announcementContent}
			</Text>
			<Button
				href={viewUrl}
				className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white"
			>
				お知らせを確認する
			</Button>
		</BaseEmailTemplate>
	);
}

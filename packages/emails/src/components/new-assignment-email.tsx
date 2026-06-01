import { Button, Text } from "@react-email/components";
import { BaseEmailTemplate } from "./base-email-template";

export default function NewAssignmentEmail({
	email,
	assignmentTitle,
	assignmentDescription,
	dueDate,
	viewUrl,
}: {
	email: string;
	assignmentTitle: string;
	assignmentDescription: string;
	dueDate?: string;
	viewUrl: string;
}) {
	return (
		<BaseEmailTemplate
			preview="新しい課題が投稿されました"
			title="新しい課題"
			email={email}
		>
			<Text className="text-base text-gray-700 leading-relaxed">
				新しい課題が投稿されました。
			</Text>
			<Text className="mt-4 font-bold text-gray-900 text-lg">
				{assignmentTitle}
			</Text>
			<Text className="mt-2 whitespace-pre-line text-base text-gray-700 leading-relaxed">
				{assignmentDescription}
			</Text>
			{dueDate && (
				<Text className="mt-2 text-gray-600 text-sm">提出期限: {dueDate}</Text>
			)}
			<Button
				href={viewUrl}
				className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white"
			>
				課題を確認する
			</Button>
		</BaseEmailTemplate>
	);
}

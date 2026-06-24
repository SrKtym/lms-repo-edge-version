import { Text } from "react-email";
import { BaseEmailTemplate } from "./base-email-template";

export default function ResetPasswordEmail({
	email,
	url,
}: {
	email: string;
	url: string;
}) {
	return (
		<BaseEmailTemplate
			preview="パスワードリセットの確認"
			title="パスワードのリセット"
			email={email}
		>
			<Text className="text-base text-gray-700 leading-relaxed">
				パスワードリセットのリクエストを受け取りました。下のリンクをクリックして
				新しいパスワードを作成してください。
			</Text>
			<Text className="break-all font-medium text-base text-blue-600">
				{url}
			</Text>
			<Text className="mt-4 text-gray-600 text-sm">
				このリンクは1時間で有効期限が切れます。
			</Text>
			<Text className="mt-4 text-amber-600 text-sm">
				🔐
				このリセットをリクエストしていない場合は、このメールを無視してください。
			</Text>
		</BaseEmailTemplate>
	);
}

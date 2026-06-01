import { Text } from "@react-email/components";
import { BaseEmailTemplate } from "./base-email-template";

export default function ConfirmSignUpEmail({
	email,
	url,
}: {
	email: string;
	url: string;
}) {
	return (
		<BaseEmailTemplate
			preview="サインアップの確認"
			title="ようこそLMSへ"
			email={email}
		>
			<Text className="text-base text-gray-700 leading-relaxed">
				サインアップしました。下のリンクをクリックして登録を完了してください。
			</Text>
			<Text className="break-all font-medium text-base text-blue-600">
				{url}
			</Text>
			<Text className="mt-4 text-gray-600 text-sm">
				このリンクは1時間で有効期限が切れます。
			</Text>
			<Text className="mt-4 text-gray-600 text-sm">
				登録が完了したら、二段階認証を設定することを推奨します。
			</Text>
		</BaseEmailTemplate>
	);
}

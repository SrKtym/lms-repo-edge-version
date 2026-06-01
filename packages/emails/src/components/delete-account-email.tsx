import { Text } from "@react-email/components";
import { BaseEmailTemplate } from "./base-email-template";

export default function DeleteAccountEmail({
	email,
	url,
}: {
	email: string;
	url: string;
}) {
	return (
		<BaseEmailTemplate
			preview="アカウント削除の確認"
			title="アカウントを削除する"
			email={email}
		>
			<Text className="text-base text-gray-700 leading-relaxed">
				アカウント削除のリクエストを受け取りました。このリクエストを送信した場合、
				下のリンクをクリックして確認してください。
			</Text>
			<Text className="break-all font-medium text-base text-blue-600">
				{url}
			</Text>
			<Text className="mt-4 font-medium text-red-600 text-sm">
				注意：この操作は元に戻せません。すべてのデータが完全に削除されます。
			</Text>
			<Text className="mt-4 text-gray-600 text-sm">
				この削除リクエストを送信していない場合は、すぐにアカウントを保護してください。
			</Text>
		</BaseEmailTemplate>
	);
}

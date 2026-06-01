import { Text } from "@react-email/components";
import { BaseEmailTemplate } from "./base-email-template";

export default function OtpNotificationEmail({
	email,
	otpCode,
}: {
	email: string;
	otpCode: string;
}) {
	return (
		<BaseEmailTemplate
			preview="OTP認証コード"
			title="OTP認証コード"
			email={email}
		>
			<Text className="text-base text-gray-700 leading-relaxed">
				認証コード：
			</Text>
			<Text className="my-4 rounded-lg bg-gray-100 p-4 text-center font-bold text-2xl text-blue-600 tracking-widest">
				{otpCode}
			</Text>
			<Text className="text-gray-600 text-sm">
				このコードは5分で有効期限が切れます。認証を完了するためにコードを入力してください。
			</Text>
			<Text className="mt-4 text-amber-600 text-sm">
				🔒 認証コードを誰かと共有しないでください。
			</Text>
		</BaseEmailTemplate>
	);
}

import { TabsFor2fa } from "@lms-repo-edge-version/ui/components/tabs";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import OtpVerifyForm from "@/components/_auth/verify-otp/otp-verify-form";
import TotpVerifyForm from "@/components/_auth/verify-otp/totp-verify-form";

export const Route = createFileRoute("/_auth/verify-otp")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "OTP認証 | LMS-repo",
			},
		],
	}),
});

function RouteComponent() {
	const navigate = useNavigate();

	const handleVerificationSuccess = () => {
		navigate({ to: "/dashboard" });
	};

	return (
		<div className="w-full max-w-md p-6">
			<div className="mb-8 text-center">
				<h1 className="mb-2 font-bold text-2xl text-gray-900 dark:text-gray-100">
					2要素認証
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					認証アプリまたはSMSからコードを入力してください
				</p>
			</div>

			<TabsFor2fa
				totpForm={<TotpVerifyForm onSuccess={handleVerificationSuccess} />}
				otpForm={<OtpVerifyForm onSuccess={handleVerificationSuccess} />}
			/>
		</div>
	);
}

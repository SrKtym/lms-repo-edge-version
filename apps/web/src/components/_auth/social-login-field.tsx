import { authClient } from "@lms-repo-edge-version/auth/web";
import { env } from "@lms-repo-edge-version/env/web";
import { GithubLogo } from "@lms-repo-edge-version/ui/assets/icons/github-logo";
import { GoogleLogo } from "@lms-repo-edge-version/ui/assets/icons/google-logo";
import { PasskeyLogo } from "@lms-repo-edge-version/ui/assets/icons/passkey-logo";
import { XLogo } from "@lms-repo-edge-version/ui/assets/icons/x-logo";
import { OutlineButton } from "@lms-repo-edge-version/ui/components/button";
import { useLocation } from "@tanstack/react-router";

export function SocialLoginField({
	onPasskeySignIn,
}: {
	onPasskeySignIn?: () => void;
}) {
	const location = useLocation();
	const providers = ["google", "github", "twitter"] as const;

	// ソーシャルログイン
	const handleSocialSignIn = async (provider: (typeof providers)[number]) => {
		await authClient.signIn.social({
			provider: provider,
			callbackURL: `${env.VITE_CLIENT_URL}/dashboard`,
			errorCallbackURL: "/sign-in",
		});
	};

	return (
		<>
			<div className="grid grid-cols-3 items-center">
				<div className="w-auto max-w-[250px] border-gray-500 border-b-1" />
				<p className="text-center">または</p>
				<div className="w-auto max-w-[250px] border-gray-500 border-b-1" />
			</div>

			<div className="flex flex-col items-center gap-4">
				{providers.map((provider) => (
					<OutlineButton
						key={provider}
						onPress={() => handleSocialSignIn(provider)}
					>
						{provider === "google" && <GoogleLogo />}
						{provider === "github" && <GithubLogo />}
						{provider === "twitter" && <XLogo />}
						<p>
							{provider.charAt(0).toUpperCase() + provider.slice(1)}でログイン
						</p>
					</OutlineButton>
				))}
				{location.pathname === "/sign-in" && (
					<OutlineButton onPress={onPasskeySignIn}>
						<PasskeyLogo />
						<p>パスキーでログイン</p>
					</OutlineButton>
				)}
			</div>
		</>
	);
}

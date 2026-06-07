import { authClient } from "@lms-repo-edge-version/auth/web";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { ControlledModal } from "@lms-repo-edge-version/ui/components/modals/controlled-modal";
import { RadioGroupFor2fa } from "@lms-repo-edge-version/ui/components/radio-group";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { RegisterTotpSecretForm } from "@/components/_auth/set-twofactor/register-totp-secret-form";
import { TwoFactorSettingForm } from "@/components/_auth/set-twofactor/twofactor-setting-form";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_auth/set-twofactor")({
	component: RouteComponent,
	beforeLoad: async () => {
		// セッションデータをキャッシュまたは取得
		const session = await queryClient.ensureQueryData({
			queryKey: ["session"],
			queryFn: async () => {
				const res = await authClient.getSession();
				return res;
			},
		});

		if (!session.data) {
			redirect({
				to: "/sign-in",
				throw: true,
			});
		}

		return { session };
	},
	loader: ({ context }) => {
		if (!context.session.data?.user) {
			throw new Error("User not found");
		}
		const { twoFactorEnabled } = context.session.data.user;
		return { twoFactorEnabled };
	},
});

function RouteComponent() {
	const { twoFactorEnabled } = Route.useLoaderData();
	const [selected, setSelected] = useState<string>("valid");
	const [totpURI, setTotpURI] = useState<string>();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="space-y-6">
			<RadioGroupFor2fa
				value={selected}
				onChange={setSelected}
				isValid={!!twoFactorEnabled}
			/>
			<div className="flex justify-end gap-4">
				<Link to="/add-passkey">
					<CancelButton>今はしない</CancelButton>
				</Link>
				<DefaultButton onPress={() => setIsModalOpen(true)}>続行</DefaultButton>
				<ControlledModal
					isOpen={isModalOpen}
					onOpenChange={setIsModalOpen}
					heading={
						totpURI
							? "TOTPシークレットキーの登録"
							: "本人確認のためパスワードを入力してください"
					}
				>
					{totpURI ? (
						<RegisterTotpSecretForm totpURI={totpURI} />
					) : (
						<TwoFactorSettingForm
							selected={selected}
							setTotpURI={(totpURI) => setTotpURI(totpURI)}
						/>
					)}
				</ControlledModal>
			</div>
		</div>
	);
}

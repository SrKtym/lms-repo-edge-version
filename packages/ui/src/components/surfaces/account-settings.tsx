import { Surface } from "@heroui/react";
import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import type { LinkComponentProps } from "../../lib/utils";
import { CancelButton, DangerButton, DefaultButton } from "../button";
import { DefaultModal } from "../modals/default-modal";

interface AccountSettingsProps {
	LinkComponent: React.ComponentType<LinkComponentProps>;
	onDeleteAccount: () => void;
}

export function AccountSettings({
	LinkComponent,
	onDeleteAccount,
}: AccountSettingsProps) {
	const style =
		"flex flex-col rounded-lg border border-divider p-4 gap-2 sm:flex-row sm:items-center sm:justify-between";

	return (
		<Surface className="mx-auto w-full max-w-2xl rounded-2xl p-6 shadow-surface">
			<h2 className="mb-6 font-bold text-foreground text-xl">アカウント設定</h2>

			<div className="space-y-6">
				{/* 2要素認証 */}
				<div className={style}>
					<div className="mb-4 sm:mb-0">
						<h3 className="mb-1 font-medium text-foreground">2要素認証</h3>
						<p className="text-foreground-600 text-sm">
							アカウントのセキュリティを強化するために2要素認証を有効化することを推奨します
						</p>
					</div>
					<LinkComponent to="/set-twofactor">
						<DefaultButton variant="primary" size="sm">
							設定ページへ
							<ArrowRight />
						</DefaultButton>
					</LinkComponent>
				</div>

				{/* パスキー */}
				<div className={style}>
					<div className="mb-4 sm:mb-0">
						<h3 className="mb-1 font-medium text-foreground">パスキー</h3>
						<p className="text-foreground-600 text-sm">
							生体認証やセキュリティキーを使用して安全にログインできます
						</p>
					</div>
					<LinkComponent to="/add-passkey">
						<DefaultButton variant="primary" size="sm">
							設定ページへ
							<ArrowRight />
						</DefaultButton>
					</LinkComponent>
				</div>

				{/* パスワードリセット */}
				<div className={style}>
					<div className="mb-4 sm:mb-0">
						<h3 className="mb-1 font-medium text-foreground">
							パスワードのリセット
						</h3>
						<p className="text-foreground-600 text-sm">
							セキュリティのため、定期的にパスワードを変更することを推奨します
						</p>
					</div>
					<LinkComponent to="/request-reset-password">
						<DefaultButton variant="primary" size="sm">
							設定ページへ
							<ArrowRight />
						</DefaultButton>
					</LinkComponent>
				</div>

				{/* アカウントの削除 */}
				<div className="flex flex-col rounded-lg border border-divider bg-danger/30 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="mb-4 sm:mb-0">
						<h3 className="mb-1 font-medium text-foreground">
							アカウントの削除
						</h3>
						<p className="text-foreground-600 text-sm">
							アカウントを削除すると、すべてのデータが完全に削除されます
						</p>
					</div>
					<DefaultModal
						triggerButton={<DangerButton size="sm">削除</DangerButton>}
						heading="アカウント削除の確認"
					>
						<p className="text-foreground">本当にアカウントを削除しますか？</p>
						<div className="flex justify-end gap-2">
							<CancelButton slot="close">キャンセル</CancelButton>
							<DangerButton slot="close" onPress={onDeleteAccount}>
								削除
							</DangerButton>
						</div>
					</DefaultModal>
				</div>
			</div>
		</Surface>
	);
}

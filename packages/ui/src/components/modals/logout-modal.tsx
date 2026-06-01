import { Modal } from "@heroui/react";
import { CancelButton, DefaultButton } from "../button";

export function LogoutModal({
	isOpen,
	onOpenChange,
	onLogout,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onLogout: () => void;
}) {
	return (
		// controlledモードで使用する場合、ModalではなくModal.Backdropを使用する
		<Modal.Backdrop
			variant="transparent"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<Modal.Container size="lg">
				<Modal.Dialog>
					<Modal.CloseTrigger />
					<Modal.Header>
						<Modal.Heading>ログアウトの確認</Modal.Heading>
					</Modal.Header>
					<Modal.Body>
						<p className="text-foreground">ログアウトしますか？</p>
					</Modal.Body>
					<Modal.Footer>
						<CancelButton slot="close">キャンセル</CancelButton>
						<DefaultButton onPress={onLogout}>ログアウト</DefaultButton>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	);
}

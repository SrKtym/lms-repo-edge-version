import { Modal } from "@heroui/react";

export function StudentsModal({
	isOpen,
	children,
}: {
	isOpen: boolean;
	children: React.ReactNode;
}) {
	return (
		// controlledモードで使用する場合、ModalではなくModal.Backdropを使用する
		<Modal.Backdrop isOpen={isOpen}>
			<Modal.Container size="cover">
				<Modal.Dialog>
					<Modal.Header>
						<Modal.Heading className="font-bold text-xl">
							学科・学年の登録をしましょう
						</Modal.Heading>
					</Modal.Header>
					<Modal.Body>{children}</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	);
}

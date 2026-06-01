import { Modal } from "@heroui/react";

interface DefaultModalProps {
	triggerButton: React.ReactNode;
	heading: string;
	children: React.ReactNode;
}

export function DefaultModal({
	triggerButton,
	heading,
	children,
}: DefaultModalProps) {
	return (
		<Modal>
			{triggerButton}
			<Modal.Backdrop variant="transparent">
				<Modal.Container size="md">
					<Modal.Dialog>
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading>{heading}</Modal.Heading>
						</Modal.Header>
						<Modal.Body>{children}</Modal.Body>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

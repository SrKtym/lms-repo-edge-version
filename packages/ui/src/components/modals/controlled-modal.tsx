import { Modal } from "@heroui/react";

interface ControlledModalProps {
	heading?: string;
	children: React.ReactNode;
	isOpen: boolean;
	onOpenChange?: (open: boolean) => void;
	size?: "sm" | "md" | "lg" | "cover";
	variant?: "transparent" | "blur" | "opaque";
	showCloseTrigger?: boolean;
	footer?: React.ReactNode;
}

export function ControlledModal({
	heading,
	children,
	isOpen,
	onOpenChange,
	size = "md",
	variant = "transparent",
	showCloseTrigger = true,
	footer,
}: ControlledModalProps) {
	return (
		// controlledモードで使用する場合、ModalではなくModal.Backdropを使用する
		<Modal.Backdrop
			variant={variant}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<Modal.Container size={size}>
				<Modal.Dialog>
					{showCloseTrigger && <Modal.CloseTrigger />}
					{heading && (
						<Modal.Header>
							<Modal.Heading>{heading}</Modal.Heading>
						</Modal.Header>
					)}
					<Modal.Body>{children}</Modal.Body>
					{footer && <Modal.Footer>{footer}</Modal.Footer>}
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	);
}

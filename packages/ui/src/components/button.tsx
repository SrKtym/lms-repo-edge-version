import { Button } from "@heroui/react";
import * as m from "motion/react-m";
import { Edit } from "../assets/icons/edit";
import { Trash } from "../assets/icons/trash";

// Default button component
export function DefaultButton(props: React.ComponentProps<typeof Button>) {
	return <Button variant="primary" {...props} />;
}

// Cancel button
export function CancelButton(props: React.ComponentProps<typeof Button>) {
	return <Button variant="tertiary" {...props} />;
}

// Danger button for critical actions
export function DangerButton(props: React.ComponentProps<typeof Button>) {
	return <Button variant="danger" {...props} />;
}

// Outline button
export function OutlineButton(props: React.ComponentProps<typeof Button>) {
	return (
		<Button fullWidth variant="outline" {...props}>
			{props.children}
		</Button>
	);
}

// Dropdown button
export function DropdownButton(props: React.ComponentProps<typeof Button>) {
	return <Button className="h-auto p-2" variant="secondary" {...props} />;
}

type MenuActionType = "edit" | "delete";

interface MenuActionButtonProps {
	type: MenuActionType;
	onClick: (e?: React.MouseEvent) => void;
}

export function MenuActionButton({ type, onClick }: MenuActionButtonProps) {
	const isEdit = type === "edit";
	const Icon = isEdit ? Edit : Trash;
	const label = isEdit ? "編集" : "削除";
	const sharedStyle = "flex items-center gap-2 rounded px-3 py-2 text-sm";
	const className = isEdit
		? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
		: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20";

	return (
		<m.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`${sharedStyle} ${className}`}
		>
			<Icon width={16} height={16} />
			<p>{label}</p>
		</m.button>
	);
}

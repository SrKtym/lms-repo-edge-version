import { Button } from "@heroui/react";
import * as m from "motion/react-m";
import { Edit } from "../assets/icons/edit";
import { MoreVertical } from "../assets/icons/more-vertical";
import { Trash } from "../assets/icons/trash";
import { DefaultTooltip } from "./tooltip";

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

interface MenuButtonProps {
	onEdit: () => void;
	onDelete: () => void;
}

// Menu button component
export function MenuButton({ onEdit, onDelete }: MenuButtonProps) {
	// トリガー要素
	const triggerElement = (
		<m.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			className="rounded-full p-1 text-white"
		>
			<MoreVertical width={18} height={18} />
		</m.button>
	);

	// コンテンツ
	const content = (
		<div className="flex flex-col gap-1">
			<m.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={(e) => {
					e.stopPropagation();
					onEdit();
				}}
				className="flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				<Edit width={16} height={16} />
				<p>編集</p>
			</m.button>
			<m.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				className="flex items-center gap-2 rounded px-3 py-2 text-red-600 text-sm hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
			>
				<Trash width={16} height={16} />
				<p>削除</p>
			</m.button>
		</div>
	);

	// ツールチップ
	return <DefaultTooltip triggerElement={triggerElement} content={content} />;
}

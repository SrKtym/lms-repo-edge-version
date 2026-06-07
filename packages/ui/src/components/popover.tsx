import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { Edit } from "../assets/icons/edit";
import { Trash } from "../assets/icons/trash";

interface LongPressPopoverProps {
	onEdit: () => void;
	onDelete: () => void;
	onClose: () => void;
	position: { x: number; y: number };
}

export function LongPressPopover({
	onEdit,
	onDelete,
	onClose,
	position,
}: LongPressPopoverProps) {
	const menuRef = useRef<HTMLDivElement>(null);

	// メニュー外クリックで閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	return (
		<m.div
			ref={menuRef}
			initial={{ opacity: 0, scale: 0.8, y: -10 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.8, y: -10 }}
			transition={{ duration: 0.2 }}
			className="fixed z-50 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800"
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
			}}
		>
			<div className="flex flex-col gap-1">
				<m.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => {
						onEdit();
						onClose();
					}}
					className="flex items-center gap-2 rounded px-3 py-2 text-gray-700 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
				>
					<Edit width={16} height={16} />
					<span>編集</span>
				</m.button>
				<m.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => {
						onDelete();
						onClose();
					}}
					className="flex items-center gap-2 rounded px-3 py-2 text-red-600 text-sm hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
				>
					<Trash width={16} height={16} />
					<span>削除</span>
				</m.button>
			</div>
		</m.div>
	);
}

interface UseLongPressHandlers {
	onTouchStart: (e: React.TouchEvent) => void;
	onTouchEnd: () => void;
}

interface UseLongPressReturn {
	handlers: UseLongPressHandlers;
}

export function useLongPress(
	onLongPress: (position: { x: number; y: number }) => void,
	delay = 500,
): UseLongPressReturn {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const startPositionRef = useRef<{ x: number; y: number } | null>(null);

	const start = (clientX: number, clientY: number) => {
		startPositionRef.current = { x: clientX, y: clientY };
		timerRef.current = setTimeout(() => {
			onLongPress({ x: clientX, y: clientY });
		}, delay);
	};

	const clear = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	const onTouchStart = (e: React.TouchEvent) => {
		const touch = e.touches[0];
		if (touch) {
			start(touch.clientX, touch.clientY);
		}
	};

	const onTouchEnd = () => {
		clear();
	};

	return {
		handlers: {
			onTouchStart,
			onTouchEnd,
		},
	};
}

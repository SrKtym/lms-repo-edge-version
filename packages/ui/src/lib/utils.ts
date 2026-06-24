import { FileText } from "../assets/icons/file-text";
import { MSExcel } from "../assets/icons/ms-excel";
import { MSPowerpoint } from "../assets/icons/ms-powerpoint";
import { MSword } from "../assets/icons/ms-word";
import { PDFFile } from "../assets/icons/pdf-file";

export { cn, parseColor } from "@heroui/react";
export {
	DateFormatter,
	type DateValue,
	fromDateToLocal,
	getLocalTimeZone,
	now,
	parseDate,
	parseZonedDateTime,
	type ZonedDateTime,
} from "@internationalized/date";

// Linkコンポーネントのprops型
export interface LinkComponentProps {
	to: string;
	children: React.ReactNode;
}

// 曜日の配列
export const DAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

// ファイルの形式に基づく配色
export function getFileColor(type: string) {
	switch (type) {
		case "pdf":
			return "danger";
		case "word":
			return "accent";
		case "excel":
			return "success";
		case "powerpoint":
			return "warning";
		default:
			return "default";
	}
}

// ファイルの形式に基づくアイコン
export function getIconByFormat(format: string) {
	switch (format) {
		case "pdf":
			return PDFFile;
		case "word":
			return MSword;
		case "excel":
			return MSExcel;
		case "powerpoint":
			return MSPowerpoint;
		default:
			return FileText;
	}
}

// 講義の履修要件に基づく配色
export function getColorbyRequirements(requirements: string) {
	switch (requirements) {
		case "必修":
			return "bg-danger/30";
		case "選択必修":
			return "bg-warning/30";
		default:
			return "bg-blue-500/30";
	}
}

// 通知の種類に基づくアイコン
export const getNotificationIcon = (title: string) => {
	if (title.includes("新しい課題")) {
		return "📝";
	}
	if (title.includes("新しいお知らせ")) {
		return "💬";
	}
	if (title.includes("システム")) {
		return "⚙️";
	}
	return "📢";
};

// 通知受信からの経過時間
export function formatTimestamp(date: Date) {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 1) return "たった今";
	if (minutes < 60) return `${minutes}分前`;
	if (hours < 24) return `${hours}時間前`;
	if (days < 7) return `${days}日前`;

	return date.toLocaleDateString("ja-JP", {
		month: "short",
		day: "numeric",
	});
}

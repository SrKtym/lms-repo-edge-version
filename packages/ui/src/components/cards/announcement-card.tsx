import type { FetchAnnouncementsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/announcements";
import { FileQuestion } from "../../assets/icons/file-question";
import { FileText } from "../../assets/icons/file-text";
import { Info } from "../../assets/icons/info";
import { BaseCard } from "../cards/base-card";
import { DefaultChip } from "../chip";

// AnnouncementCard component
export function AnnouncementCard({
	data,
}: {
	data: FetchAnnouncementsFromUserCoursesReturnType[number];
}) {
	function getFileIcon(type: string) {
		switch (type) {
			case "資料":
				return <FileText />;
			case "アンケート":
				return <FileQuestion />;
			default:
				return <Info />;
		}
	}

	function getChipColor(type: string) {
		switch (type) {
			case "資料":
				return "accent";
			case "アンケート":
				return "success";
			default:
				return "default";
		}
	}

	const dateOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	return (
		<BaseCard
			key={data.id}
			className="border border-gray-200 dark:border-gray-700"
		>
			<div className="flex gap-3">
				<div className="mt-1">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
						{data.type && (
							<div className="text-gray-600 dark:text-gray-400">
								{getFileIcon(data.type)}
							</div>
						)}
					</div>
				</div>
				<div className="flex-1">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h3 className="font-medium text-gray-900 dark:text-gray-100">
								{data.title}
							</h3>
							<p className="text-gray-500 text-sm dark:text-gray-400">
								{data.createdAt.toLocaleDateString("default", dateOptions)}
							</p>
						</div>
						<DefaultChip size="sm" color={getChipColor(data.type)}>
							{data.type}
						</DefaultChip>
					</div>

					<div className="mt-3">
						<p className="text-gray-700 leading-relaxed dark:text-gray-300">
							{data.description}
						</p>
					</div>
				</div>
			</div>
		</BaseCard>
	);
}

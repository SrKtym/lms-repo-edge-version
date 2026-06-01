import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import { getFileColor, getIconByFormat } from "../../lib/utils";
import { BaseCard } from "../cards/base-card";
import { DefaultChip } from "../chip";

// AssignmentCard component
export function AssignmentCard({
	assignment,
}: {
	assignment: FetchAssignmentsFromUserCoursesReturnType[number];
}) {
	const dateOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	const isOverdue = assignment.dueDate < new Date();
	const daysUntilDue = Math.ceil(
		(assignment.dueDate.getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24),
	);

	return (
		<BaseCard
			key={assignment.id}
			className="border border-gray-200 dark:border-gray-700"
		>
			<div className="flex gap-3">
				<div className="mt-1">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
						{(() => {
							const Icon = getIconByFormat(assignment.format);
							return <Icon />;
						})()}
					</div>
				</div>

				<div className="flex-1">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h3 className="font-medium text-gray-900 dark:text-gray-100">
								{assignment.title}
							</h3>
							<div className="mt-1 flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
								<span>
									期限:{" "}
									{assignment.dueDate.toLocaleDateString(
										"default",
										dateOptions,
									)}
								</span>
								{isOverdue && (
									<span className="font-medium text-danger">期限切れ</span>
								)}
								{!isOverdue && daysUntilDue <= 3 && (
									<span className="font-medium text-warning">
										{daysUntilDue === 0 ? "今日まで" : `残り${daysUntilDue}日`}
									</span>
								)}
							</div>
						</div>

						<DefaultChip size="sm" color={getFileColor(assignment.format)}>
							{assignment.format}
						</DefaultChip>
					</div>

					{assignment.description && (
						<div className="mt-3">
							<p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">
								{assignment.description}
							</p>
						</div>
					)}

					{assignment.points >= 0 && (
						<div className="mt-2 flex items-center gap-2">
							<span className="text-gray-500 text-sm dark:text-gray-400">
								得点:
							</span>
							<span className="font-medium text-gray-900 dark:text-gray-100">
								{assignment.points}点
							</span>
						</div>
					)}
				</div>
			</div>
		</BaseCard>
	);
}

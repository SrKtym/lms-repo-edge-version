import type { FetchSubmissionsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/submissions";
import { BaseCard } from "../cards/base-card";
import { DefaultChip } from "../chip";

interface EvaluatedCardProps {
	submission: FetchSubmissionsFromUserCoursesReturnType[number];
	isTeacher: boolean;
}

// EvaluatedCard component
export function EvaluatedCard({ submission, isTeacher }: EvaluatedCardProps) {
	return (
		<BaseCard className="border border-divider">
			<div className="p-6">
				<h2 className="mb-4 font-medium text-lg">
					{isTeacher ? "評価済みの提出物" : "評価済みの課題"}
				</h2>
				<div className="space-y-4">
					<div className="border-divider border-b pb-4 last:border-b-0">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<h3 className="font-medium text-gray-900 dark:text-gray-100">
									{submission.assignmentTitle}
								</h3>
								<div className="mt-1 space-y-1">
									<p className="text-default-500 text-sm">
										ステータス:{" "}
										<span className="font-medium">{submission.status}</span>
									</p>
									{submission.assignmentDueDate && (
										<p className="text-default-500 text-sm">
											提出日:{" "}
											{submission.assignmentDueDate.toLocaleDateString(
												"default",
											)}
										</p>
									)}
									{/* {submission.score !== null && (
										<p className="text-default-500 text-sm">
											採点日:{" "}
											{submission.score.toLocaleDateString("default")}
										</p>
									)} */}
								</div>
							</div>
							{submission.score !== null && (
								<div className="text-right">
									<DefaultChip size="sm" color="success">
										{submission.score} 点
									</DefaultChip>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</BaseCard>
	);
}

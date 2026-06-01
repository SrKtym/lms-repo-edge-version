import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import type { FetchSubmissionByIdReturnType } from "@lms-repo-edge-version/db/utils/query/submissions";
import { BaseCard } from "../cards/base-card";
import { DefaultChip } from "../chip";

interface SubmissionsCardProps {
	targetAssignment: FetchAssignmentsFromUserCoursesReturnType[number];
	targetSubmission?: FetchSubmissionByIdReturnType[number];
	children?: React.ReactNode;
}

export function SubmissionsCard({
	targetAssignment,
	targetSubmission,
	children,
}: SubmissionsCardProps) {
	return (
		<BaseCard className="border border-divider lg:h-full lg:max-h-[600px]">
			<div className="p-2">
				<div className="flex items-center justify-between">
					<h2 className="font-medium text-lg">
						課題（{targetAssignment.title}）の提出
					</h2>
					<DefaultChip
						color={
							targetSubmission?.status === "提出済み"
								? "success"
								: targetSubmission?.status === "未提出"
									? "warning"
									: "accent"
						}
					>
						{targetSubmission?.status ? "提出済み" : "未提出"}
					</DefaultChip>
				</div>

				<div className="mt-4">{children}</div>
			</div>
		</BaseCard>
	);
}

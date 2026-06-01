import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import { FileText } from "../../assets/icons/file-text";
import { DefaultButton } from "../button";
import { BaseCard } from "../cards/base-card";

interface OtherAssignmentCardProps {
	assignments: FetchAssignmentsFromUserCoursesReturnType;
	dateOptionforAnnouncement?: Intl.DateTimeFormatOptions;
}

// OtherAssignmentCard component
export function OtherAssignmentCard({
	assignments,
	dateOptionforAnnouncement = {
		year: "numeric",
		month: "short",
		day: "numeric",
	},
}: OtherAssignmentCardProps) {
	return (
		<BaseCard className="border border-divider">
			<div className="p-4">
				<h3 className="mb-3 font-medium text-medium">この講義の他の課題</h3>
				<div className="space-y-3">
					{assignments.map((assignment) => (
						<DefaultButton
							key={assignment.id}
							className="h-auto w-full justify-start py-2 text-left"
						>
							<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-content2">
								<FileText />
							</div>
							<div className="truncate">
								<p className="truncate font-medium">{assignment.title}</p>
								<p className="text-default-500 text-xs">
									{assignment.dueDate.toLocaleDateString(
										"default",
										dateOptionforAnnouncement,
									)}
								</p>
							</div>
						</DefaultButton>
					))}
				</div>
			</div>
		</BaseCard>
	);
}

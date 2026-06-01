import { BaseCard } from "../cards/base-card";
import { DefaultChip } from "../chip";

// Type definitions
interface AssignmentStatusCardProps {
	currentAssignment: {
		dueDate: Date;
		points?: number;
		assignmentStatus?: {
			status: string;
		};
	} | null;
	dateOptionforAnnouncement?: Intl.DateTimeFormatOptions;
	getAssignmentStatusColor?: (
		status: string,
	) => "default" | "success" | "warning" | "danger" | "accent";
}

// AssignmentStatusCard component
export function AssignmentStatusCard({
	currentAssignment,
	dateOptionforAnnouncement = {
		year: "numeric",
		month: "short",
		day: "numeric",
	},
	getAssignmentStatusColor = () => "default",
}: AssignmentStatusCardProps) {
	return (
		<BaseCard className="border border-divider">
			<div className="p-6">
				<h2 className="mb-3 font-medium text-lg">提出状況</h2>
				<div className="space-y-6">
					{currentAssignment && (
						<div className="space-y-2">
							{/* Due date */}
							<p className="mb-1 text-default-500 text-sm">期限</p>
							<p className="ml-3 font-medium text-sm">
								{currentAssignment.dueDate.toLocaleDateString(
									"default",
									dateOptionforAnnouncement,
								)}
							</p>

							{/* Student submission status */}
							<div>
								<p className="mb-1 text-default-500 text-sm">提出状況</p>
								<DefaultChip
									size="sm"
									className="ml-3"
									color={getAssignmentStatusColor(
										currentAssignment.assignmentStatus?.status || "",
									)}
								>
									{currentAssignment.assignmentStatus?.status}
								</DefaultChip>
							</div>

							{/* Points */}
							<div>
								<p className="mb-1 text-default-500 text-sm">点</p>
								<p className="ml-3 font-medium text-sm">
									{currentAssignment?.points} 点
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</BaseCard>
	);
}

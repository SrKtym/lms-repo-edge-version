import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import { getIconByFormat } from "@lms-repo-edge-version/ui/lib/utils";
import { BaseCard } from "../cards/base-card";
import { DefaultChip } from "../chip";
import { DefaultSeparator } from "../separator";

interface AssignmentDetailCardProps {
	targetAssignment: FetchAssignmentsFromUserCoursesReturnType[number];
	getFileColor?: (
		type: string,
	) => "default" | "success" | "warning" | "danger" | "accent";
}

// AssignmentDetailCard component
export function AssignmentDetailCard({
	targetAssignment,
}: AssignmentDetailCardProps) {
	if (!targetAssignment) return null;

	return (
		<BaseCard className="border border-divider">
			<div className="p-6">
				<div className="flex items-start justify-between">
					<div className="flex gap-4">
						<div className="mt-1">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-content2">
								{(() => {
									const Icon = getIconByFormat(targetAssignment.format);
									return <Icon width={32} height={32} />;
								})()}
							</div>
						</div>
						<div className="space-y-2">
							<h1 className="font-medium text-2xl">{targetAssignment.title}</h1>
							<div className="mt-2">
								<DefaultChip size="sm" color="accent">
									{targetAssignment.points || 0} 点
								</DefaultChip>
							</div>
						</div>
					</div>
				</div>

				<DefaultSeparator className="my-6" />

				<div className="mb-6">
					<div className="mb-1 flex items-center gap-2">
						<span className="font-medium">期限</span>
					</div>
					<p className="ml-6 text-default-600">
						{targetAssignment.dueDate.toLocaleDateString()}
					</p>
				</div>

				<div className="mb-6">
					<div className="mb-2 flex items-center gap-2">
						<span className="font-medium">説明</span>
					</div>
					<p className="ml-6 text-default-600">
						{targetAssignment.description}
					</p>
				</div>

				<div className="mb-6">
					<div className="mb-2 flex items-center gap-2">
						<span className="font-medium">添付ファイル</span>
					</div>
					<p className="ml-6 text-default-600">
						{/* ここに添付ファイルをダウンロードする機能を実装 */}
						なし
					</p>
				</div>
			</div>
		</BaseCard>
	);
}

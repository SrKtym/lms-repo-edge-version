import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import type { FetchSubmissionsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/submissions";
import { TrendingUp } from "@lms-repo-edge-version/ui/assets/icons/trending-up";
import { BaseCard } from "../cards/base-card";
import { DefaultProgressBar } from "../progress-bar";

interface AssignmentsProgressCardProps {
	assignments: FetchAssignmentsFromUserCoursesReturnType;
	submissions: FetchSubmissionsFromUserCoursesReturnType;
	overdueAssignments: FetchAssignmentsFromUserCoursesReturnType;
}

export function AssignmentsProgressCard({
	assignments,
	submissions,
	overdueAssignments,
}: AssignmentsProgressCardProps) {
	const totalAssignments = assignments.length;
	const submittedAssignments = submissions.filter(
		(submission) => submission.status === "提出済み",
	);
	const evaluatedAssignments = submissions.filter(
		(submission) => submission.status === "評定済み",
	);

	const submittedCount = submittedAssignments.length;
	const evaluatedCount = evaluatedAssignments.length;
	const overdueCount = overdueAssignments.length;

	const completionRate =
		totalAssignments > 0
			? Math.round((submittedCount / totalAssignments) * 100)
			: 0;
	const averageGrade =
		submittedAssignments.length > 0
			? Math.round(
					submittedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) /
						submittedAssignments.length,
				)
			: 0;

	return (
		<BaseCard className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-green-50/30 p-5 shadow-lg backdrop-blur-sm dark:from-gray-800 dark:to-green-900/20">
			{/* Decorative background elements */}
			<div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-green-400/10 to-emerald-400/10 blur-2xl" />
			<div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-400/10 to-green-400/10 blur-xl" />

			<div className="relative z-10 space-y-5">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="text-green-600">
							<TrendingUp width={24} height={24} />
						</div>
						<h2 className="font-semibold text-gray-900 text-lg dark:text-gray-100">
							課題進行状況
						</h2>
					</div>
					<div className="text-right">
						<div className="font-bold text-blue-600 text-xl dark:text-blue-400">
							{completionRate}%
						</div>
						<div className="text-gray-600 text-xs dark:text-gray-400">
							達成率
						</div>
					</div>
				</div>

				{/* Progress bar */}
				<div className="space-y-2">
					<div className="flex justify-between text-gray-600 text-xs dark:text-gray-400">
						<span>全体の進捗</span>
						<span>
							{submittedCount} / {totalAssignments}
						</span>
					</div>
					<DefaultProgressBar value={completionRate} />
				</div>

				{/* Statistics cards */}
				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
						<div className="font-bold text-green-600 text-lg dark:text-green-400">
							{submittedCount}
						</div>
						<div className="text-green-700 text-xs dark:text-green-300">
							提出済み
						</div>
					</div>

					<div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
						<div className="font-bold text-blue-600 text-lg dark:text-blue-400">
							{evaluatedCount}
						</div>
						<div className="text-blue-700 text-xs dark:text-blue-300">
							評定済み
						</div>
					</div>

					<div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
						<div className="font-bold text-lg text-red-600 dark:text-red-400">
							{overdueCount}
						</div>
						<div className="text-red-700 text-xs dark:text-red-300">
							期限切れ
						</div>
					</div>
				</div>

				{/* Average grade and recent submission */}
				<div className="grid grid-cols-1 gap-3">
					<div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950">
						<div className="mb-1 text-purple-700 text-xs dark:text-purple-300">
							平均評価点
						</div>
						<div className="font-bold text-2xl text-purple-600 dark:text-purple-400">
							{averageGrade}
						</div>
					</div>

					<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
						<div className="mb-1 text-gray-700 text-xs dark:text-gray-300">
							最近の提出
						</div>
						<div className="font-medium text-gray-900 text-xs dark:text-gray-100">
							{submittedAssignments.length > 0
								? submittedAssignments[submittedAssignments.length - 1]
										?.assignmentTitle || "タイトルなし"
								: "提出済みの課題はありません"}
						</div>
					</div>
				</div>
			</div>
		</BaseCard>
	);
}

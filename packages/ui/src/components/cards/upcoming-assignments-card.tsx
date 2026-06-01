import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import { FileDocument } from "@lms-repo-edge-version/ui/assets/icons/file-document";
import { getIconByFormat } from "@lms-repo-edge-version/ui/lib/utils";
import { useState } from "react";
import { DefaultSelect } from "../select";
import { BaseCard } from "./base-card";

export function UpcomingAssignmentsCard({
	assignments,
}: {
	assignments: FetchAssignmentsFromUserCoursesReturnType;
}) {
	const [selectedPeriod, setSelectedPeriod] = useState("7日以内");

	const periodOptions = ["3日以内", "7日以内", "すべて"];
	const filteredAssignments = assignments.filter(
		(assignment) =>
			assignment.dueDate.getTime() - new Date().getTime() <=
			(selectedPeriod === "3日以内"
				? 3
				: selectedPeriod === "7日以内"
					? 7
					: Number.POSITIVE_INFINITY) *
				24 *
				60 *
				60 *
				1000,
	);

	const getDaysUntilDue = (dueDate: Date) => {
		const now = new Date();
		const diffTime = dueDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return `期限切れ (${Math.abs(diffDays)}日前)`;
		if (diffDays === 0) return "今日が期限";
		if (diffDays === 1) return "明日が期限";
		return `${diffDays}日後`;
	};

	return (
		<BaseCard className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-orange-50/30 p-5 shadow-lg backdrop-blur-sm dark:from-gray-800 dark:to-orange-900/20">
			{/* Decorative background elements */}
			<div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-orange-400/10 to-yellow-400/10 blur-2xl" />
			<div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-tr from-yellow-400/10 to-orange-400/10 blur-xl" />

			<div className="relative z-10">
				<div className="mb-5 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileDocument width={24} height={24} />
						<h1 className="font-semibold text-lg">直近の課題</h1>
						{assignments.length > 0 && (
							<span className="rounded bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs dark:bg-blue-900 dark:text-blue-200">
								{assignments.length}件
							</span>
						)}
					</div>
					<DefaultSelect
						className="w-32"
						items={periodOptions}
						value={selectedPeriod}
						onChange={(value) => {
							if (typeof value === "string") {
								setSelectedPeriod(value);
							}
						}}
					/>
				</div>

				{filteredAssignments.length > 0 ? (
					<div className="max-h-[240px] space-y-3 overflow-y-auto">
						{filteredAssignments.map((assignment) => (
							<div
								key={assignment.id}
								className="rounded-lg border bg-gradient-to-r from-white to-orange-50/50 p-3 transition-all hover:border-orange-300 hover:shadow-md dark:border-gray-700 dark:from-gray-800 dark:to-orange-900/30 dark:hover:border-orange-600"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1">
										<div className="mb-1 flex items-center gap-2">
											<span className="text-sm">
												{(() => {
													const Icon = getIconByFormat(assignment.format);
													return <Icon width={20} height={20} />;
												})()}
											</span>
											<h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">
												{assignment.title}
											</h3>
										</div>

										{assignment.description && (
											<p className="mb-1 line-clamp-2 text-gray-600 text-xs dark:text-gray-400">
												{assignment.description}
											</p>
										)}

										<div className="flex items-center gap-3 text-gray-500 text-xs dark:text-gray-400">
											<span>{assignment.courseName}</span>
											<span>•</span>
											<span
												className={`font-medium ${
													new Date() > assignment.dueDate
														? "text-red-600 dark:text-red-400"
														: "text-gray-600 dark:text-gray-400"
												}`}
											>
												{getDaysUntilDue(assignment.dueDate)}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="relative py-12 text-center">
						<div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-orange-50/30 dark:from-gray-800/50 dark:to-orange-900/30" />
						<div className="relative z-10">
							<p className="font-medium text-gray-500 dark:text-gray-400">
								直近の課題はありません
							</p>
							<p className="mt-1 text-gray-400 text-sm dark:text-gray-500">
								他の期間を選択してみてください
							</p>
						</div>
					</div>
				)}
			</div>
		</BaseCard>
	);
}

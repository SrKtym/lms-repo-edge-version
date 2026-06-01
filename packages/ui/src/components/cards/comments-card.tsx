import type { FetchCommentsWithAssignmentReturnType } from "@lms-repo-edge-version/db/utils/query/comments";
import { DefaultAvatar } from "../avatar";
import { BaseCard } from "../cards/base-card";

interface CommentsCardProps {
	comments: FetchCommentsWithAssignmentReturnType;
	dateOptionforAnnouncement?: Intl.DateTimeFormatOptions;
	children?: React.ReactNode;
}

// CommentsCard component
export function CommentsCard({
	comments,
	dateOptionforAnnouncement = {
		year: "numeric",
		month: "short",
		day: "numeric",
	},
	children,
}: CommentsCardProps) {
	return (
		<BaseCard className="border border-divider lg:h-full lg:max-h-[600px]">
			<div className="space-y-6 p-2">
				<h2 className="mb-4 font-medium text-lg">コメント</h2>
				{children}
				<div className="space-y-6 lg:max-h-[300px] lg:overflow-y-auto">
					{comments.length > 0 ? (
						comments.map((comment) => (
							<div key={comment.id} className="flex items-center gap-3">
								<div className="flex-shrink-0">
									<DefaultAvatar
										userName={comment.createdBy}
										src={comment.avatar}
									/>
								</div>
								<div>
									<div className="flex items-center gap-2">
										<p className="font-medium">{comment.createdBy}</p>
										<p className="text-default-500 text-xs">
											{comment.createdAt.toLocaleString(
												"default",
												dateOptionforAnnouncement,
											)}
										</p>
									</div>
									<p className="mt-1">{comment.content}</p>
								</div>
							</div>
						))
					) : (
						<p className="text-center">コメントがありません</p>
					)}
				</div>
			</div>
		</BaseCard>
	);
}

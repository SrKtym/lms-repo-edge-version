import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import type { FetchSubmissionsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/submissions";
import { ArrowLeft } from "@lms-repo-edge-version/ui/assets/icons/arrow-left";
import { CancelButton } from "@lms-repo-edge-version/ui/components/button";
import { AssignmentDetailCard } from "@lms-repo-edge-version/ui/components/cards/assignment-detail-card";
import { CommentsCard } from "@lms-repo-edge-version/ui/components/cards/comments-card";
import { SubmissionsCard } from "@lms-repo-edge-version/ui/components/cards/submissions-card";
import { TabsForSubmissions } from "@lms-repo-edge-version/ui/components/tabs";
import { Link } from "@tanstack/react-router";
import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { useCommentsWithAssignment } from "@/hooks/comments";
import { CreateCommentForm } from "./create-comment-form";
import { CreateFileSubmissionForm } from "./create-file-submission-form";
import { CreateTextSubmissionForm } from "./create-text-submission-form";

interface RegisteredCourseContentsProps {
	targetAssignment?: FetchAssignmentsFromUserCoursesReturnType[number];
	submission?: FetchSubmissionsFromUserCoursesReturnType[number];
	assignmentId: string;
}

export default function RegisteredCourseContents({
	targetAssignment,
	submission,
	assignmentId,
}: RegisteredCourseContentsProps) {
	if (!targetAssignment) {
		return <div>課題が見つかりません。</div>;
	}
	const { data: comments = [] } = useCommentsWithAssignment(assignmentId);

	const propaties = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.3 },
	};

	return (
		<div className="space-y-8 pb-12">
			{/* ヘッダー */}
			<div className="relative flex h-24 items-end bg-primary">
				<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
				<div className="container relative z-10 mx-auto max-w-screen-xl px-4 py-4">
					<div className="flex items-center space-x-4">
						<Link
							to="/course-list"
							search={(prev) => ({ ...prev, "assignment-id": undefined })}
							className="flex items-center gap-1"
						>
							<CancelButton size="sm">
								<ArrowLeft />
								戻る
							</CancelButton>
						</Link>
						{targetAssignment && (
							<div className="text-sm text-white opacity-80">
								{targetAssignment.courseName} / 課題の詳細
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="container m-auto max-w-screen-xl px-4">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<LazyMotion features={domAnimation}>
						{/* 課題の詳細 */}
						<m.div {...propaties} className="lg:col-span-2">
							<AssignmentDetailCard targetAssignment={targetAssignment} />
						</m.div>

						{/* 提出（学生用） */}
						<m.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 }}
						>
							<SubmissionsCard
								targetAssignment={targetAssignment}
								targetSubmission={submission}
							>
								<div className="space-y-2">
									<TabsForSubmissions
										textTab={<CreateTextSubmissionForm />}
										attachmentsTab={
											<CreateFileSubmissionForm assignmentId={assignmentId} />
										}
									/>
								</div>
							</SubmissionsCard>
						</m.div>

						{/* コメント */}
						<m.div
							{...propaties}
							transition={{ ...propaties.transition, delay: 0.2 }}
						>
							<CommentsCard comments={comments}>
								<CreateCommentForm />
							</CommentsCard>
						</m.div>
					</LazyMotion>
				</div>
			</div>
		</div>
	);
}

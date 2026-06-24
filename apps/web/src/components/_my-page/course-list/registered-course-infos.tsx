import type { FetchAnnouncementsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/announcements";
import type { FetchAssignmentsFromUserCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/assignments";
import type { FetchRegisteredCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/courses";
import { ArrowLeft } from "@lms-repo-edge-version/ui/assets/icons/arrow-left";
import { DefaultAvatar } from "@lms-repo-edge-version/ui/components/avatar";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { AnnouncementCard } from "@lms-repo-edge-version/ui/components/cards/announcement-card";
import { AssignmentCard } from "@lms-repo-edge-version/ui/components/cards/assignment-card";
import { Image } from "@lms-repo-edge-version/ui/components/image";
import { Loader } from "@lms-repo-edge-version/ui/components/loader";
import { TabsForCourseInfo } from "@lms-repo-edge-version/ui/components/tabs";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAnnouncements } from "@/hooks/announcements";
import { useAssignments } from "@/hooks/assignments";
import { useMembersByCourseId } from "@/hooks/students";
import { CreateAnnouncementForm } from "./create-announcement-form";
import { CreateAssignmentForm } from "./create-assignment-form";

interface RegisteredCourseInfosProps {
	courseWithCoverImage?: FetchRegisteredCoursesReturnType[number] & {
		coverImage?: string;
	};
	announcements: FetchAnnouncementsFromUserCoursesReturnType;
	assignments: FetchAssignmentsFromUserCoursesReturnType;
	courseId: string;
}

export default function RegisteredCourseInfos({
	courseWithCoverImage,
	announcements,
	assignments,
	courseId,
}: RegisteredCourseInfosProps) {
	if (!courseWithCoverImage) {
		return <div>講義が見つかりません。</div>;
	}

	const { data: announcementsData = [] } = useAnnouncements(announcements);
	const { data: assignmentsData = [] } = useAssignments(assignments);
	const { data: members = [], isPending } = useMembersByCourseId(courseId);
	const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
	const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

	const targetAnnouncements = announcementsData.filter(
		(announcement) => announcement.courseId === courseId,
	);
	const targetAssignments = assignmentsData.filter(
		(assignment) => assignment.courseId === courseId,
	);

	return (
		<>
			{/* Course Header */}
			<div className="relative flex h-48 items-end md:h-64">
				<div className="absolute inset-0">
					<Image
						src={courseWithCoverImage.coverImage || ""}
						layout="fullWidth"
						sizes="100vw"
						className="h-full w-full object-cover"
						alt="Course background"
						decoding="async"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
					<Link
						to="/course-list"
						search={(prev) => ({ ...prev, "course-id": undefined })}
						className="absolute top-4 left-4 flex items-center gap-1"
					>
						<CancelButton size="sm">
							<ArrowLeft />
							戻る
						</CancelButton>
					</Link>
				</div>
				<div className="container relative z-10 mx-auto max-w-screen-xl p-6">
					<div className="text-white">
						<h1 className="font-medium text-2xl md:text-3xl">
							{courseWithCoverImage.name}
						</h1>
						<p className="mt-1 text-white/80">
							{courseWithCoverImage.classRoom}
						</p>
						<p className="text-white/80">{courseWithCoverImage.professor}</p>
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="border-gray-200 border-b bg-white dark:border-gray-700 dark:bg-gray-800">
				<div className="container mx-auto max-w-screen-xl space-y-3 px-3 pt-1 pb-3">
					<TabsForCourseInfo
						announcementsTab={
							<div>
								<div className="mb-6 flex items-center justify-between">
									<h2 className="font-medium text-gray-900 text-xl dark:text-gray-100">
										お知らせ
									</h2>
									<DefaultButton
										onPress={() => setIsAnnouncementModalOpen(true)}
									>
										お知らせを作成
									</DefaultButton>
								</div>
								<CreateAnnouncementForm
									isOpen={isAnnouncementModalOpen}
									onOpenChange={setIsAnnouncementModalOpen}
								/>

								{targetAnnouncements.length > 0 ? (
									<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
										{targetAnnouncements.map((announcement) => (
											<AnnouncementCard
												key={announcement.id}
												announcement={announcement}
											/>
										))}
									</div>
								) : (
									<div className="py-12 text-center">
										<p className="text-gray-500 dark:text-gray-400">
											お知らせはまだありません
										</p>
									</div>
								)}
							</div>
						}
						assignmentsTab={
							<div>
								<div className="mb-6 flex items-center justify-between">
									<h2 className="font-medium text-gray-900 text-xl dark:text-gray-100">
										課題
									</h2>
									<DefaultButton onPress={() => setIsAssignmentModalOpen(true)}>
										課題を作成
									</DefaultButton>
								</div>
								<CreateAssignmentForm
									isOpen={isAssignmentModalOpen}
									onOpenChange={setIsAssignmentModalOpen}
								/>

								{targetAssignments.length > 0 ? (
									<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
										{targetAssignments.map((assignment) => (
											<Link
												key={assignment.id}
												to="/course-list"
												search={(prev) => ({
													...prev,
													"assignment-id": assignment.id,
												})}
												className="block"
											>
												<AssignmentCard assignment={assignment} />
											</Link>
										))}
									</div>
								) : (
									<div className="py-12 text-center">
										<p className="text-gray-500 dark:text-gray-400">
											まだ課題がありません
										</p>
									</div>
								)}
							</div>
						}
						membersTab={
							<div>
								<h2 className="mb-6 font-medium text-gray-900 text-xl dark:text-gray-100">
									コースメンバー
								</h2>

								{members.length > 0 ? (
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
										{isPending ? (
											<Loader />
										) : (
											members.map((member) => (
												<div
													key={member.id}
													className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
												>
													<div className="flex items-center space-x-3">
														<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
															<DefaultAvatar
																src={member.avatar}
																userName={member.name}
															/>
														</div>
														<h3 className="font-medium text-gray-900 dark:text-gray-100">
															{member.name}
														</h3>
													</div>
												</div>
											))
										)}
									</div>
								) : (
									<div className="py-12 text-center">
										<p className="text-gray-500 dark:text-gray-400">
											受講者はいません
										</p>
									</div>
								)}
							</div>
						}
					/>
				</div>
			</div>
		</>
	);
}

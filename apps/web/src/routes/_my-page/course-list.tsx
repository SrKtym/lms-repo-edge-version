import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import RegisteredCourseContents from "@/components/_my-page/course-list/registered-course-contents";
import RegisteredCourseInfos from "@/components/_my-page/course-list/registered-course-infos";
import RegisteredCourseList from "@/components/_my-page/course-list/registered-course-list";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import {
	fetchAnnouncementsQueryFn,
	fetchAssignmentsQueryFn,
	fetchRegisteredCoursesQueryFn,
	fetchSubmissionByIdQueryFn,
} from "@/utils/query-utils";

const searchSchema = z.object({
	"course-id": z.string().optional(),
	"assignment-id": z.string().optional(),
});

export const Route = createFileRoute("/_my-page/course-list")({
	component: RouteComponent,
	validateSearch: (search) => searchSchema.parse(search),
	loaderDeps: ({ search: { "assignment-id": assignmentId } }) => ({
		assignmentId,
	}),
	loader: async ({ deps: { assignmentId } }) => {
		// キャッシュからデータ取得
		const [courses, announcements, assignments, submission] = await Promise.all(
			[
				queryClient.ensureQueryData({
					queryKey: ["registered-courses"],
					queryFn: fetchRegisteredCoursesQueryFn,
					...QUERY_CONFIG.STUDENT_DATA,
				}),
				queryClient.ensureQueryData({
					queryKey: ["announcements-related-courses"],
					queryFn: fetchAnnouncementsQueryFn,
				}),
				queryClient.ensureQueryData({
					queryKey: ["assignments-related-courses"],
					queryFn: fetchAssignmentsQueryFn,
				}),
				queryClient.ensureQueryData({
					queryKey: ["submissions-related-courses", assignmentId],
					queryFn: () => fetchSubmissionByIdQueryFn(assignmentId),
				}),
			],
		);

		return { courses, announcements, assignments, submission };
	},
});

function RouteComponent() {
	const { "course-id": courseId, "assignment-id": assignmentId } =
		Route.useSearch();
	const { courses, announcements, assignments, submission } =
		Route.useLoaderData();

	// 各講義のカバー画像を生成し、coursesWithCoverImageに追加
	const dataLength = courses.length;
	const coverImageList = Array.from(
		{ length: dataLength },
		(_, i) => `https://img.heroui.chat/image/landscape?w=1200&h=400&u=${i + 1}`,
	);
	const coursesWithCoverImage = courses.map((course, index) => ({
		...course,
		coverImage: coverImageList[index],
	}));

	// 登録講義一覧ページ
	if (!courseId) {
		return (
			<RegisteredCourseList coursesWithCoverImage={coursesWithCoverImage} />
		);
	}
	// 講義詳細ページ
	if (!assignmentId) {
		const targetCourse = coursesWithCoverImage.find(
			(course) => course.id === courseId,
		);
		const targetAnnouncements = announcements.filter(
			(announcement) => announcement.courseId === courseId,
		);
		const targetAssignments = assignments.filter(
			(assignment) => assignment.courseId === courseId,
		);
		return (
			<RegisteredCourseInfos
				courseWithCoverImage={targetCourse}
				announcements={targetAnnouncements}
				assignments={targetAssignments}
				courseId={courseId}
			/>
		);
	}
	// 課題詳細ページ
	const targetAssignment = assignments.find(
		(assignment) => assignment.id === assignmentId,
	);

	return (
		<RegisteredCourseContents
			targetAssignment={targetAssignment}
			submission={submission[0]}
			assignmentId={assignmentId}
		/>
	);
}

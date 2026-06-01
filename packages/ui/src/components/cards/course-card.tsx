import type { FetchRegisteredCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/courses";
import { DAYS } from "../../lib/utils";
import { DefaultAvatar } from "../avatar";
import { BaseCard } from "../cards/base-card";
import { Image } from "../image";

// Type definitions
interface CourseCardProps {
	course: FetchRegisteredCoursesReturnType[number] & { coverImage?: string };
	LinkComponent?: React.ReactNode;
}

// CourseCard component
export function CourseCard({ course, LinkComponent }: CourseCardProps) {
	return (
		<BaseCard
			key={course.id}
			className="overflow-hidden border border-divider px-0 pt-0"
		>
			<Image
				src={course.coverImage ?? ""}
				alt={course.name}
				layout="fullWidth"
			/>
			<div className="p-3">
				<div className="flex gap-3">
					<DefaultAvatar userName={course.professor} />
					<div className="flex-1">
						<h3 className="font-medium text-lg">{course.name}</h3>
						<div className="flex flex-col gap-1 text-gray-600 text-sm dark:text-gray-400">
							<p>
								{DAYS[course.weekdays]}曜 {course.period}限
							</p>
							<p>{course.credits} 単位</p>
							<p>担当教員: {course.professor}</p>
							<p>教室: {course.classRoom}</p>
						</div>
					</div>
				</div>
			</div>
			<div className="border-divider border-t px-4 py-3">{LinkComponent}</div>
		</BaseCard>
	);
}

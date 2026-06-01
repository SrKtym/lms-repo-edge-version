import type { FetchRegisteredCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/courses";
import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import { BookOpen } from "@lms-repo-edge-version/ui/assets/icons/book-open";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { CourseCard } from "@lms-repo-edge-version/ui/components/cards/course-card";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import { DefaultSearchField } from "@lms-repo-edge-version/ui/components/search-field";
import { DefaultSelect } from "@lms-repo-edge-version/ui/components/select";
import { Link } from "@tanstack/react-router";
import * as m from "motion/react-m";
import { useState } from "react";

export default function RegisteredCourseList({
	coursesWithCoverImage,
}: {
	coursesWithCoverImage: (FetchRegisteredCoursesReturnType[number] & {
		coverImage?: string;
	})[];
}) {
	const selectItems = ["昇順", "降順"];
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOrder, setSortOrder] = useState("昇順");

	// 検索フィルタリング
	const filteredCourses = coursesWithCoverImage.filter(
		(course) =>
			course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.professor.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// ソート
	const sortedCourses = filteredCourses.sort((a, b) => {
		if (sortOrder === "昇順") {
			return a.name.localeCompare(b.name, "ja-JP");
		}
		return b.name.localeCompare(a.name, "ja-JP");
	});

	return (
		<div className="container relative z-10 mx-auto max-w-screen-xl px-4 py-6">
			<div className="mb-6 items-center justify-between space-y-3 sm:flex">
				<h1 className="font-medium text-2xl text-gray-900 dark:text-gray-100">
					登録済みの講義
				</h1>
				<div className="flex items-center gap-4">
					<DefaultSearchField
						placeholder="講義名または教員名で検索"
						value={searchQuery}
						onChange={setSearchQuery}
					/>
				</div>
			</div>

			{sortedCourses.length > 0 ? (
				<div className="mb-8">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-medium text-gray-800 text-lg dark:text-gray-200">
							すべての講義 ({sortedCourses.length}件)
						</h2>
						<div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
							<span>並び替え:</span>
							<DefaultSelect
								aria-label="options"
								className="w-32"
								items={selectItems}
								value={sortOrder}
								onChange={(value) => {
									if (typeof value === "string") {
										setSortOrder(value);
									}
								}}
							/>
						</div>
					</div>

					<LazyMotionProvider>
						<m.div
							className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
							variants={{
								hidden: { opacity: 0 },
								visible: { opacity: 1 },
							}}
							transition={{
								staggerChildren: 0.1,
							}}
							initial="hidden"
							animate="visible"
						>
							{sortedCourses.map((currentCourseData) => (
								<m.div
									key={currentCourseData.id}
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: {
											opacity: 1,
											y: 0,
										},
									}}
									transition={{ duration: 0.3 }}
								>
									<m.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
										<CourseCard
											course={currentCourseData}
											LinkComponent={
												<Link
													to="/course-list"
													search={{
														"course-id": currentCourseData.id,
													}}
												>
													<DefaultButton size="sm">
														詳細を見る
														<ArrowRight />
													</DefaultButton>
												</Link>
											}
										/>
									</m.div>
								</m.div>
							))}
						</m.div>
					</LazyMotionProvider>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-16">
					<div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
						<div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-2xl" />
						<BookOpen width={48} height={48} />
					</div>
					<h2 className="mb-2 font-medium text-gray-900 text-xl dark:text-gray-100">
						{searchQuery
							? "該当する講義がありません"
							: "履修する講義がありません"}
					</h2>
					<p className="mb-6 max-w-md text-center text-gray-600 dark:text-gray-400">
						{searchQuery
							? "別のキーワードで検索してみてください"
							: "まずは履修する講義を登録してください"}
					</p>
					{!searchQuery && (
						<Link to="/register-courses">
							<DefaultButton>
								履修登録のページへ
								<ArrowRight />
							</DefaultButton>
						</Link>
					)}
				</div>
			)}
		</div>
	);
}

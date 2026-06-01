import type { FetchCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/courses";
import { Check } from "@lms-repo-edge-version/ui/assets/icons/check";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { TimeTableCard } from "@lms-repo-edge-version/ui/components/cards/time-table-card";
import { DefaultChip } from "@lms-repo-edge-version/ui/components/chip";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import { DefaultModal } from "@lms-repo-edge-version/ui/components/modals/default-modal";
import { Toast } from "@lms-repo-edge-version/ui/components/toast";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as m from "motion/react-m";
import { z } from "zod";
import {
	useCheckCourse,
	useRegisterCourse,
	useRegisteredCourses,
	useSearchCourses,
	useUnregisterCourse,
} from "@/hooks/courses";
import { queryClient } from "@/lib/query-client";
import { fetchRegisteredCoursesQueryFn } from "@/utils/query-utils";

export const Route = createFileRoute("/_my-page/register-courses")({
	component: RouteComponent,
	validateSearch:
		z.custom<Partial<Omit<FetchCoursesReturnType[number], "id">>>(),
	loader: async () => {
		// キャッシュがあればキャッシュからデータ取得
		const initialCourses = await queryClient.ensureQueryData({
			queryKey: ["registered-courses"],
			queryFn: fetchRegisteredCoursesQueryFn,
			staleTime: 1000 * 60 * 60 * 24, // 24時間は「新鮮」と見なす
			gcTime: 1000 * 60 * 60 * 24 * 7, // 7日間はキャッシュを保持
		});
		return { initialCourses };
	},
});

function RouteComponent() {
	const { initialCourses } = Route.useLoaderData();
	const { weekdays, period } = Route.useSearch();
	const navigate = useNavigate();

	// 登録済み講義の取得
	const { data: courses = [] } = useRegisteredCourses(initialCourses);

	// 講義の検索（無限スクロール対応）
	const {
		data: searchCoursesData,
		isPending,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useSearchCourses(weekdays, period);

	// 全ページのデータをフラット化
	const searchCourses = searchCoursesData?.pages.flat() || [];

	// 講義の登録
	const { mutate: handleRegisterCourses } = useRegisterCourse(searchCourses);

	// 登録講義の確定
	const { mutate: handleCheckCourse } = useCheckCourse();

	// 講義の削除
	const { mutate: handleDeleteCourse } = useUnregisterCourse();

	// search paramsのセット
	const handleCellClick = (day: number, period: number) => {
		navigate({
			to: "/register-courses",
			search: { weekdays: day, period },
		});
	};

	const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);
	const everyCourseIsChecked = courses.every((course) => course.isChecked);

	return (
		<div className="space-y-6 p-3">
			<Toast.Provider placement="top" />
			<LazyMotionProvider>
				<m.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex items-center justify-between"
				>
					<h2 className="font-bold text-xl">履修登録</h2>
				</m.div>

				<m.div
					className="grid grid-cols-1 gap-6"
					layout
					transition={{ duration: 0.5, ease: "easeInOut" }}
				>
					<m.div
						className="space-y-6"
						layout
						transition={{
							duration: 0.5,
							ease: "easeInOut",
						}}
					>
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
							<m.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className="mb-2 flex items-center justify-between"
							>
								<h2 className="font-bold text-xl">時間割</h2>
								<m.div
									key={courses.length}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.2 }}
									className="flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400"
								>
									<p>取得予定の単位数: {totalCredits}</p>
									{courses.length > 0 && (
										<DefaultModal
											triggerButton={
												<DefaultButton size="sm">
													<Check />
													<p className="max-sm:hidden">登録を確定する</p>
												</DefaultButton>
											}
											heading="登録講義の確認"
										>
											<div className="space-y-4">
												<p className="text-gray-700 dark:text-gray-300">
													以下の講義を登録してもよろしいですか？
												</p>
												<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
													<table className="w-full">
														<thead>
															<tr className="border-gray-200 border-b dark:border-gray-600">
																<th className="pb-2 text-left font-semibold text-gray-900 dark:text-white">
																	講義名
																</th>
																<th className="pb-2 text-right font-semibold text-gray-900 dark:text-white">
																	単位数
																</th>
															</tr>
														</thead>
														<tbody>
															{courses.map((course, index) => (
																<tr
																	key={course.id}
																	className={
																		index < courses.length - 1
																			? "border-gray-100 border-b dark:border-gray-600"
																			: ""
																	}
																>
																	<td className="py-2 text-gray-900 dark:text-white">
																		{course.name}
																	</td>
																	<td className="py-2 text-right text-gray-900 dark:text-white">
																		{course.credits}
																	</td>
																</tr>
															))}
															<tr className="border-gray-300 border-t-2 dark:border-gray-500">
																<td className="py-2 font-bold text-gray-900 dark:text-white">
																	合計単位数
																</td>
																<td className="py-2 text-right font-bold text-gray-900 dark:text-white">
																	{totalCredits}
																</td>
															</tr>
														</tbody>
													</table>
												</div>
												<div className="flex justify-end gap-2">
													<CancelButton slot="close">キャンセル</CancelButton>
													<DefaultButton
														slot="close"
														onPress={() => handleCheckCourse}
													>
														確定
													</DefaultButton>
												</div>
											</div>
										</DefaultModal>
									)}
									{courses.length > 0 && everyCourseIsChecked && (
										<DefaultChip color="success">
											<Check />
											登録完了
										</DefaultChip>
									)}
								</m.div>
							</m.div>

							<m.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.1 }}
							>
								<TimeTableCard
									courses={courses}
									onDeleteCourse={handleDeleteCourse}
									onCourseSelect={handleRegisterCourses}
									onCellClick={handleCellClick}
									isPending={isPending}
									availableCourses={searchCourses}
									hasNextPage={hasNextPage}
									fetchNextPage={fetchNextPage}
									isFetchingNextPage={isFetchingNextPage}
								/>
							</m.div>
						</div>
					</m.div>
				</m.div>
			</LazyMotionProvider>
		</div>
	);
}

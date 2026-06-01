import type {
	FetchCoursesReturnType,
	FetchRegisteredCoursesReturnType,
} from "@lms-repo-edge-version/db/utils/query/courses";
import { Edit } from "@lms-repo-edge-version/ui/assets/icons/edit";
import { Plus } from "@lms-repo-edge-version/ui/assets/icons/plus";
import { Trash } from "@lms-repo-edge-version/ui/assets/icons/trash";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { DAYS, getColorbyRequirements } from "../../lib/utils";
import { OutlineButton } from "../button";
import { CourseSelectionModal } from "../modals/course-selection-modal";
import { BaseCard } from "./base-card";

interface TimeTableCardProps {
	courses: FetchRegisteredCoursesReturnType;
	onDeleteCourse: (courseId: string) => void;
	onCourseSelect: (courseId: string) => void;
	onCellClick: (day: number, period: number) => void;
	isPending?: boolean;
	availableCourses: FetchCoursesReturnType;
	hasNextPage?: boolean;
	fetchNextPage?: () => void;
	isFetchingNextPage?: boolean;
}

export function TimeTableCard({
	courses,
	onDeleteCourse,
	onCourseSelect,
	onCellClick,
	isPending = false,
	availableCourses,
	hasNextPage = false,
	fetchNextPage,
	isFetchingNextPage = false,
}: TimeTableCardProps) {
	// Generate timeSlots and extract unique values
	const timeSlots = Array.from({ length: 5 }, (_, dayIndex) =>
		Array.from({ length: 5 }, (_, periodIndex) => {
			const day = dayIndex + 1;
			const period = periodIndex + 1;
			const course =
				courses.find((c) => c.weekdays === day && c.period === period) || null;
			return { day, period, course };
		}),
	).flat();

	const uniqueDays = [...new Set(timeSlots.map((slot) => slot.day))];
	const uniquePeriods = [...new Set(timeSlots.map((slot) => slot.period))];

	const [hasHover, setHasHover] = useState<boolean>(false);
	const [openPopover, setOpenPopover] = useState<Record<string, boolean>>({
		"": false,
	});

	// メディアクエリで hover の可否を判定
	useEffect(() => {
		const mql = window.matchMedia("(hover: hover)");
		setHasHover(mql.matches);
	}, []);

	return (
		<BaseCard className="p-6">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr>
							<th className="border border-gray-300 bg-gray-50 p-2 font-medium text-sm dark:border-gray-600 dark:bg-gray-800">
								時間
							</th>
							{uniqueDays.map((day) => (
								<m.th
									key={day}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, delay: 0.1 + day * 0.05 }}
									className="min-w-[120px] border border-gray-300 bg-gray-50 p-2 font-medium text-sm dark:border-gray-600 dark:bg-gray-800"
								>
									{` ${DAYS[day]} `}
								</m.th>
							))}
						</tr>
					</thead>
					<tbody>
						{uniquePeriods.map((period) => (
							<m.tr
								key={period}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.2,
									delay: 0.2 + period * 0.05,
								}}
							>
								<td className="border border-gray-300 bg-gray-50 p-2 text-center font-medium text-sm dark:border-gray-600 dark:bg-gray-800">
									{`${period} `}
								</td>
								{uniqueDays.map((day) => {
									const targetSlot = timeSlots.find(
										(s) => s.day === day && s.period === period,
									);
									return (
										<m.td
											key={`${day}-${period}`}
											className="h-20 border border-gray-300 p-1 align-top dark:border-gray-600"
										>
											<AnimatePresence mode="wait">
												{targetSlot?.course ? (
													<m.div
														key={targetSlot.course.id}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.8 }}
														transition={{ duration: 0.2 }}
														className={`${getColorbyRequirements(targetSlot.course.requirements)} group relative h-full rounded border p-2 text-xs hover:shadow-md`}
														onClick={() =>
															setOpenPopover((prev) => ({
																[targetSlot?.course?.id || ""]:
																	!prev[targetSlot?.course?.id || ""],
															}))
														}
													>
														<div className="truncate font-semibold text-xs">
															{targetSlot.course.name}
														</div>
														<div className="mt-1 truncate text-gray-600 dark:text-gray-300">
															{targetSlot.course.professor}
														</div>
														<div className="mt-1 text-gray-500 dark:text-gray-400">
															{targetSlot.course.credits}単位
														</div>
														{/* タッチデバイスでない場合は表示しない */}
														{hasHover && (
															<div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
																<div className="flex gap-1">
																	<CourseSelectionModal
																		triggerButton={
																			<OutlineButton
																				className="rounded-full bg-blue-500 text-white"
																				size="sm"
																				onPress={() => onCellClick(day, period)}
																			>
																				<Edit width={10} height={10} />
																			</OutlineButton>
																		}
																		onCourseSelect={(course) =>
																			onCourseSelect(course.id)
																		}
																		selectedCell={{ day, period }}
																		availableCourses={availableCourses}
																		isPending={isPending}
																		hasNextPage={hasNextPage}
																		fetchNextPage={fetchNextPage}
																		isFetchingNextPage={isFetchingNextPage}
																	/>
																	<OutlineButton
																		className="rounded-full bg-red-500 text-white hover:bg-red-600"
																		size="sm"
																		onPress={() =>
																			targetSlot.course &&
																			onDeleteCourse(targetSlot.course.id)
																		}
																	>
																		<Trash width={12} height={12} />
																	</OutlineButton>
																</div>
															</div>
														)}
														{/* タッチデバイスの場合に表示 */}
														{!hasHover &&
															targetSlot.course.id in openPopover && (
																<m.div
																	initial={{ opacity: 0 }}
																	animate={{ opacity: 1 }}
																	transition={{ duration: 0.2 }}
																	className="absolute top-1 right-1"
																>
																	<div className="flex gap-1">
																		<CourseSelectionModal
																			triggerButton={
																				<OutlineButton
																					className="rounded-full bg-blue-500 text-white"
																					size="sm"
																					onPress={() =>
																						onCellClick(day, period)
																					}
																				>
																					<Edit width={10} height={10} />
																				</OutlineButton>
																			}
																			onCourseSelect={(course) =>
																				onCourseSelect(course.id)
																			}
																			selectedCell={{ day, period }}
																			availableCourses={availableCourses}
																			isPending={isPending}
																			hasNextPage={hasNextPage}
																			fetchNextPage={fetchNextPage}
																			isFetchingNextPage={isFetchingNextPage}
																		/>
																		<OutlineButton
																			className="rounded-full bg-red-500 text-white"
																			size="sm"
																			onPress={() =>
																				targetSlot.course &&
																				onDeleteCourse(targetSlot.course.id)
																			}
																		>
																			<Trash width={12} height={12} />
																		</OutlineButton>
																	</div>
																</m.div>
															)}
													</m.div>
												) : (
													<CourseSelectionModal
														triggerButton={
															<OutlineButton
																className="h-full rounded-lg"
																onPress={() => onCellClick(day, period)}
															>
																<Plus />
															</OutlineButton>
														}
														onCourseSelect={(course) =>
															onCourseSelect(course.id)
														}
														selectedCell={{ day, period }}
														availableCourses={availableCourses}
														isPending={isPending}
														hasNextPage={hasNextPage}
														fetchNextPage={fetchNextPage}
														isFetchingNextPage={isFetchingNextPage}
													/>
												)}
											</AnimatePresence>
										</m.td>
									);
								})}
							</m.tr>
						))}
					</tbody>
				</table>
			</div>

			<m.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.4 }}
				className="mt-6 space-y-3"
			>
				<h3 className="font-semibold text-sm">登録済み講義一覧</h3>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					<AnimatePresence>
						{courses.map((course, index) => (
							<m.div
								key={course.name}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.2, delay: 0.5 + index * 0.1 }}
								className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
							>
								<div className="flex-1">
									<div className="font-medium text-sm">{course.name}</div>
									<div className="mt-1 text-gray-600 text-xs dark:text-gray-400">
										{course.professor} • {course.classRoom} • {course.credits}
										単位
									</div>
								</div>
								<m.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
									className={`h-4 w-4 rounded-full ${getColorbyRequirements(course.requirements)}`}
								/>
							</m.div>
						))}
					</AnimatePresence>
				</div>
			</m.div>
		</BaseCard>
	);
}

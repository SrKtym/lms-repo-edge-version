import { eq } from "drizzle-orm";
import { createDb } from "../index";
import { courseList } from "../mock/course-data";
import { coursesMaster } from "../mock/course-master";
import { courses, departments, faculties, professors, user } from "../schema";

export async function seedCourseData() {
	const facultyNames = Object.keys(coursesMaster).filter(
		(name): name is keyof typeof coursesMaster => name in coursesMaster,
	);

	// 学科名から講義名のマッピング (例: { "文学科": ["文学理論", "日本史", ...] })
	const departmentToCoursesMap: Record<string, string[]> = {};

	facultyNames.forEach((facultyName) => {
		const facultyData = coursesMaster[facultyName];
		Object.entries(facultyData).forEach(([deptName, coursesList]) => {
			if (coursesList.length > 0) {
				departmentToCoursesMap[deptName] = coursesList;
			}
		});
	});

	// 学科ごとの必修単位数を取得する関数
	function getRequiredCredits(departmentName: string): number {
		switch (departmentName) {
			case "医学科":
				return 200;
			case "看護学科":
				return 140;
			case "保健学科":
				return 140;
			default:
				return 130;
		}
	}

	await createDb().transaction(async (tx) => {
		try {
			// 学部の登録
			const insertedFaculties = await tx
				.insert(faculties)
				.values(facultyNames.map((name) => ({ name })))
				.returning()
				.onConflictDoNothing();

			// 講義名から学部IDを引くためのマッピング: { "文学部": "faculty-id-1", "理学部": "faculty-id-2" }
			const facultyMapping = new Map(
				insertedFaculties.map((f) => [f.name, f.id]),
			);
			const departmentNames = Object.values(coursesMaster).flatMap(Object.keys);
			const departmentValues = departmentNames.map((name) => {
				let facultyId: string | undefined;
				const requiredCredits = getRequiredCredits(name);
				facultyNames.forEach((facultyName) => {
					if (name in coursesMaster[facultyName]) {
						facultyId = facultyMapping.get(facultyName);
					}
				});
				if (!facultyId) {
					throw new Error(`Faculty not found for department ${name}`);
				}
				return {
					name,
					facultyId,
					requiredCredits,
				};
			});

			// 学科の登録
			const insertedDepartments = await tx
				.insert(departments)
				.values(departmentValues)
				.returning()
				.onConflictDoNothing();

			// 学科名から学科IDを引くためのマッピング: { "文学科": "dept-id-1", "理学科": "dept-id-2" }
			const deptMapping = new Map(
				insertedDepartments.map((d) => [d.name, d.id]),
			);

			const courseValues: (typeof courses.$inferInsert)[] = [];

			const professorIds = await tx
				.select({ id: user.id })
				.from(user)
				.where(eq(user.role, "professor"));

			// 教授の割り当てと所属学科を追跡
			const professorCourseCount = new Map<string, number>();
			const professorDepartmentMap = new Map<string, string>(); // professorId -> departmentId

			// ヘルパー
			function findSuitableProfessor(
				departmentId: string,
				professorIds: { id: string }[],
			): string | undefined {
				let selectedProfessorId: string | undefined;
				let attempts = 0;
				const maxAttempts = professorIds.length * 3;

				// 制約のある教授を探す
				while (attempts < maxAttempts && !selectedProfessorId) {
					const randomIndex = Math.floor(Math.random() * professorIds.length);
					const professorId = professorIds[randomIndex]?.id;

					if (!professorId) {
						attempts++;
						continue;
					}

					const currentCount = professorCourseCount.get(professorId) || 0;
					const assignedDepartment = professorDepartmentMap.get(professorId);

					// Assignment constraintsをチェック
					if (currentCount < 2) {
						if (currentCount === 0) {
							// 1講義目: どの学科でも割り当て可能
							selectedProfessorId = professorId;
							professorCourseCount.set(professorId, 1);
							professorDepartmentMap.set(professorId, departmentId);
						} else if (currentCount === 1) {
							// 2講義目: 最初の講義と同じ学科である必要がある
							if (assignedDepartment === departmentId) {
								selectedProfessorId = professorId;
								professorCourseCount.set(professorId, 2);
							}
						}
					}
					attempts++;
				}

				return selectedProfessorId;
			}

			// ヘルパー: 最も少ない講義数の教授を探す
			function findProfessorWithMinimumCount(
				departmentId: string,
				professorIds: { id: string }[],
			): string | undefined {
				let minCount = Number.POSITIVE_INFINITY;
				let minProfessorId: string | undefined;

				for (const professor of professorIds) {
					const count = professorCourseCount.get(professor.id) || 0;
					const assignedDept = professorDepartmentMap.get(professor.id);

					// 0講義の教授を優先、その後同じ学科の1講義の教授
					if (count === 0) {
						minCount = count;
						minProfessorId = professor.id;
					} else if (
						count === 1 &&
						assignedDept === departmentId &&
						count < minCount
					) {
						minCount = count;
						minProfessorId = professor.id;
					}
				}

				if (minProfessorId) {
					const currentCount = professorCourseCount.get(minProfessorId) || 0;
					professorCourseCount.set(minProfessorId, currentCount + 1);

					// 最初の講義の場合、学科を設定
					if (currentCount === 0) {
						professorDepartmentMap.set(minProfessorId, departmentId);
					}
				}

				return minProfessorId;
			}

			// ヘルパー: 最後の手段として教授を割り当てる
			function assignProfessorAsLastResort(
				departmentId: string,
				professorIds: { id: string }[],
			): string | undefined {
				const randomIndex = Math.floor(Math.random() * professorIds.length);
				const professorId = professorIds[randomIndex]?.id;

				if (professorId) {
					const currentCount = professorCourseCount.get(professorId) || 0;
					professorCourseCount.set(professorId, currentCount + 1);

					if (currentCount === 0) {
						professorDepartmentMap.set(professorId, departmentId);
					}
				}

				return professorId;
			}

			// 教授を割り当てる
			departmentNames.forEach((deptName) => {
				const departmentId = deptMapping.get(deptName);
				if (!departmentId) throw new Error(`Department ${deptName} not found`);

				const deptCourses = departmentToCoursesMap[deptName] || [];
				deptCourses.forEach((courseName: string) => {
					const courseValue = courseList.find(
						(course) => course.name === courseName,
					);
					if (!courseValue) throw new Error(`Course ${courseName} not found`);

					// 制約のある教授を探す
					let selectedProfessorId = findSuitableProfessor(
						departmentId,
						professorIds,
					);

					// 教授が見つからなければ、最も少ない講義数の教授に割り当てる
					if (!selectedProfessorId) {
						selectedProfessorId = findProfessorWithMinimumCount(
							departmentId,
							professorIds,
						);
					}

					// 最後の手段: どの教授も割り当てられない場合、任意の教授に割り当てる
					if (!selectedProfessorId) {
						selectedProfessorId = assignProfessorAsLastResort(
							departmentId,
							professorIds,
						);
					}

					if (!selectedProfessorId) {
						throw new Error(`Professor not found for course ${courseName}`);
					}

					courseValues.push({
						...courseValue,
						departmentId,
						professorId: selectedProfessorId,
					});
				});
			});

			// 教授データの登録（重複を避けるためにユニークな教授のみ）
			const uniqueProfessors = new Map<string, string>(); // professorId -> departmentId
			courseValues.forEach((course) => {
				uniqueProfessors.set(course.professorId, course.departmentId);
			});

			const professorValues = Array.from(uniqueProfessors.entries()).map(
				([id, departmentId]) => ({
					id,
					departmentId,
				}),
			);

			await tx.insert(professors).values(professorValues).onConflictDoNothing();
			// 講義の登録
			await tx.insert(courses).values(courseValues).onConflictDoNothing();

			console.log("トランザクションが成功しました。");
		} catch (error) {
			console.error("トランザクションが失敗しました", error);
		}
	});
}

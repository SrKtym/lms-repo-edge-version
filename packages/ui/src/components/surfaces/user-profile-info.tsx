import { Surface } from "@heroui/react";
import type { FetchCompletedCoursesReturnType } from "@lms-repo-edge-version/db/utils/query/courses";
import type { FetchStudentDataReturnType } from "@lms-repo-edge-version/db/utils/query/students";
import { DefaultAvatar } from "../avatar";

// ユーザーデータの型定義
interface UserData {
	email: string;
	name: string;
	image?: string | null;
	role?: string | null;
}

interface UserProfileInfoProps {
	user: UserData &
		Partial<
			FetchStudentDataReturnType[number] &
				FetchCompletedCoursesReturnType[number]
		>;
}

export function UserProfileInfo({ user }: UserProfileInfoProps) {
	const isStudent = user.role === "student";
	const isProfessor = user.role === "professor";
	const style = "flex items-center gap-2";

	return (
		<Surface className="mx-auto w-full max-w-2xl rounded-2xl p-6 shadow-surface">
			<div className="flex flex-col gap-6 sm:flex-row">
				{/* プロフィール画像 */}
				<div className="flex-shrink-0">
					<DefaultAvatar size="lg" src={user.image} userName={user.name} />
				</div>

				{/* 基本情報 */}
				<div className="flex-grow">
					<h1 className="mb-2 font-bold text-2xl text-foreground">
						{user.name}
					</h1>
					<div className="space-y-2 text-foreground-600">
						<div className={style}>
							<span className="font-medium">メールアドレス:</span>
							<span>{user.email}</span>
						</div>

						{/* 属性表示 */}
						<div className={style}>
							<span className="font-medium">属性:</span>
							<span className="capitalize">
								{isStudent ? "学生" : isProfessor ? "教授" : "一般ユーザー"}
							</span>
						</div>

						{/* 学生情報 */}
						{isStudent && user && (
							<div className="mt-3 space-y-1 border-divider border-t pt-3">
								<h3 className="font-medium text-foreground">学籍情報</h3>
								<div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
									<div className={style}>
										<p className="font-medium">学年:</p>
										<p>{user.grade}年</p>
									</div>
									<div className={style}>
										<p className="font-medium">学部:</p>
										<p>{user.faculty}</p>
									</div>
									<div className={style}>
										<p className="font-medium">学科:</p>
										<p>{user.department}</p>
									</div>
									<div className={style}>
										<p className="font-medium">卒業必要単位数:</p>
										<p>{user.requiredCredit}単位</p>
									</div>
									<div className={`${style} col-span-2`}>
										<p className="font-medium">修了済み講義の単位数:</p>
										<p>{user.totalCredits || 0}単位</p>
									</div>
								</div>
							</div>
						)}

						{/* 教授情報 */}
						{isProfessor && user && (
							<div className="mt-3 space-y-1 border-divider border-t pt-3">
								<h3 className="font-medium text-foreground">所属情報</h3>
								<div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
									<div className={style}>
										<span className="font-medium">学部:</span>
										<span>{user.faculty}</span>
									</div>
									<div className={style}>
										<span className="font-medium">学科:</span>
										<span>{user.department}</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Surface>
	);
}

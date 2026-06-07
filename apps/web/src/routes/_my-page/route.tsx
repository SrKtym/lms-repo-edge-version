// マイページレイアウト
import { authClient } from "@lms-repo-edge-version/auth/web";
import { ControlledModal } from "@lms-repo-edge-version/ui/components/modals/controlled-modal";
import { Toast } from "@lms-repo-edge-version/ui/components/toast";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { CreateStudentDataForm } from "@/components/_my-page/shared/create-student-data-form";
import { Header } from "@/components/_my-page/shared/header";
import { QUERY_CONFIG, queryClient } from "@/lib/query-client";
import { fetchStudentDataQueryFn } from "@/utils/query-utils";

// Queryキャッシュの永続化（ブラウザのlocalStorageに保存）設定
const asyncStoragePersister = createAsyncStoragePersister({
	storage: localStorage,
	key: "react-query-cache", // キャッシュのキーを明示的に指定
	serialize: (data) => JSON.stringify(data), // シリアライズ方法を明示
	deserialize: (data) => JSON.parse(data), // デシリアライズ方法を明示
});

export const Route = createFileRoute("/_my-page")({
	component: MyPageLayoutComponent,
	beforeLoad: async () => {
		// セッションデータをキャッシュまたは取得
		const session = await queryClient.ensureQueryData({
			queryKey: ["session"],
			queryFn: async () => {
				const res = await authClient.getSession();
				return res;
			},
		});

		if (!session.data) {
			redirect({
				to: "/sign-in",
				throw: true,
			});
		}

		return { session };
	},
	loader: async ({ context }) => {
		if (!context.session.data?.user) {
			throw new Error("User not found");
		}
		const { email, name, image, role } = context.session.data.user;

		const studentData = await queryClient.ensureQueryData({
			queryKey: ["studentData"],
			queryFn: async () => {
				const data = await fetchStudentDataQueryFn();
				return data;
			},
			...QUERY_CONFIG.STUDENT_DATA,
		});
		return { email, name, image, role, studentData };
	},
});

function MyPageLayoutComponent() {
	const { studentData, role, ...userData } = Route.useLoaderData();

	return (
		<div className="relative min-h-screen">
			{/* Background - inherited from __root.tsx */}
			{/* Content */}
			<Toast.Provider placement="top" />
			<div className="relative z-10 flex flex-col">
				<PersistQueryClientProvider
					client={queryClient}
					persistOptions={{
						persister: asyncStoragePersister,
						dehydrateOptions: {
							// 特定のクエリキーのみを永続化
							shouldDehydrateQuery: (query) => {
								// 成功したクエリのみ
								if (query.state.status !== "success") {
									return false;
								}
								// studentDataのみを永続化
								const queryKey = query.queryKey;
								const filteredQueryKey = queryKey.filter(
									(key) =>
										key === "studentData" ||
										key === "totalCredits" ||
										key === "email-notification-settings" ||
										key === "registered-courses",
								);
								return filteredQueryKey.length > 0;
							},
							// ミューテーションは永恒化しない
							shouldDehydrateMutation: () => false,
						},
						// 24時間キャッシュを保持
						maxAge: 1000 * 60 * 60 * 24,
					}}
				>
					<Header {...userData} />
					{role === "student" && studentData.length === 0 ? (
						<ControlledModal
							isOpen={true}
							heading="学科・学年の登録をしましょう"
							size="cover"
							showCloseTrigger={false}
						>
							<CreateStudentDataForm />
						</ControlledModal>
					) : null}
					<main className="flex-1">
						<Outlet />
					</main>
				</PersistQueryClientProvider>
				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="p-4 text-gray-500 text-sm dark:text-gray-400">
						© 2026 LMS. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}

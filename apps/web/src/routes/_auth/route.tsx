// 認証レイアウト
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
	return (
		<div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
			{/* Background - inherited from __root.tsx */}
			{/* Content */}
			<div className="w-full max-w-md">
				<Outlet />
			</div>

			{/* Footer */}
			<div className="mt-8 text-center">
				<p className="p-4 text-gray-500 text-sm dark:text-gray-400">
					&copy; 2026 LMS. All rights reserved.
				</p>
			</div>
		</div>
	);
}

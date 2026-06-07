import type { UserData } from "@lms-repo-edge-version/auth/web";
import { authClient } from "@lms-repo-edge-version/auth/web";
import { Books } from "@lms-repo-edge-version/ui/assets/icons/books";
import { DefaultAvatar } from "@lms-repo-edge-version/ui/components/avatar";
import { DropdownMenuForAccount } from "@lms-repo-edge-version/ui/components/dropdown-menus/account-dropdown";
import {
	DropdownMenuForNavLink,
	links,
} from "@lms-repo-edge-version/ui/components/dropdown-menus/nav-dropdown";
import { DefaultSeparator } from "@lms-repo-edge-version/ui/components/separator";
import { ThemeSwitch } from "@lms-repo-edge-version/ui/components/switch";
import { toast } from "@lms-repo-edge-version/ui/components/toast";
import { cn } from "@lms-repo-edge-version/ui/lib/utils";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

export function Header({ email, name, image }: UserData) {
	const location = useLocation();
	const navigate = useNavigate();

	// トースト表示
	function showToast(error: { status: number }) {
		switch (error.status) {
			case 400:
			case 404:
				toast.danger("ログアウトに失敗しました");
				break;
			case 500:
				toast.danger(
					"予期しないエラーが発生しました。お手数ですが再度試行してください。",
				);
		}
	}

	// ログアウト処理
	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/" });
				},
				onError: ({ error }) => {
					showToast(error);
				},
			},
		});
	};

	return (
		<>
			<div className="flex flex-row items-center justify-between px-3 py-2">
				<nav className="flex items-center gap-4 text-lg">
					<DropdownMenuForNavLink LinkComponent={Link} />
					<div className="flex items-center gap-2">
						<Books />
						<h1 className="font-bold text-3xl">LMS</h1>
					</div>
					<DefaultSeparator orientation="vertical" className="max-md:hidden" />
					{links.map(({ icon, to, label }) => {
						return (
							<Link
								key={to}
								to={to}
								className={cn(
									"nav-link nav-link-shrink",
									location.pathname === to && "nav-link-active",
								)}
							>
								<span>{icon}</span>
								<p>{label}</p>
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<ThemeSwitch />
					<DropdownMenuForAccount LinkComponent={Link} onLogout={handleLogout}>
						<DefaultAvatar src={image} userName={name} />
						<div className="flex flex-col text-start text-foreground max-sm:hidden">
							<h3>{name}</h3>
							<p className="text-gray-500 text-sm dark:text-gray-400">
								{email}
							</p>
						</div>
					</DropdownMenuForAccount>
				</div>
			</div>
			<hr />
		</>
	);
}

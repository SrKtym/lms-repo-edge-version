import { Dropdown } from "@heroui/react";
import type React from "react";
import { useState } from "react";
import type { LinkComponentProps } from "../../lib/utils";
import { DropdownButton } from "../button";
import { LogoutModal } from "../modals/logout-modal";

interface DropdownMenuForAccountProps {
	children: React.ReactNode;
	LinkComponent: React.ComponentType<LinkComponentProps>;
	onLogout: () => void;
}

// Account dropdown menu
export function DropdownMenuForAccount({
	children,
	LinkComponent,
	onLogout,
}: DropdownMenuForAccountProps) {
	const itemList = [
		{ key: "profile", label: "プロフィールと設定" },
		{ key: "logout", label: "ログアウト" },
	] as const;

	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<Dropdown>
				<DropdownButton>{children}</DropdownButton>
				<Dropdown.Popover placement="bottom end">
					<Dropdown.Menu>
						<Dropdown.Section>
							{itemList.map(({ key, label }) => {
								switch (key) {
									case "profile":
										return (
											<Dropdown.Item key={key}>
												<LinkComponent to={`/${key}`}>{label}</LinkComponent>
											</Dropdown.Item>
										);
									case "logout":
										return (
											<Dropdown.Item
												key={key}
												onPress={() => {
													setIsModalOpen(true);
												}}
											>
												{label}
											</Dropdown.Item>
										);
								}
							})}
						</Dropdown.Section>
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>

			{isModalOpen && (
				<LogoutModal
					isOpen={isModalOpen}
					onOpenChange={setIsModalOpen}
					onLogout={onLogout}
				/>
			)}
		</>
	);
}

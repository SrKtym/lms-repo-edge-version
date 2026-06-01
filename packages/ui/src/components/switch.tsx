import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";

// テーマスイッチ
export function ThemeSwitch() {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<Switch
			key="theme-switch"
			size="lg"
			isSelected={isDark}
			onChange={() => setTheme(isDark ? "light" : "dark")}
		>
			{({ isSelected }) => (
				<Switch.Control
					className={isSelected ? "bg-purple-500" : "bg-orange-500"}
				>
					<Switch.Thumb>
						<Switch.Icon>{isSelected ? "🌙" : "☀️"}</Switch.Icon>
					</Switch.Thumb>
				</Switch.Control>
			)}
		</Switch>
	);
}

interface EmailNotificationSwitchProps {
	isSelected: boolean;
	onChange: () => void;
}

// メール通知スイッチ
export function EmailNotificationSwitch({
	isSelected,
	onChange,
}: EmailNotificationSwitchProps) {
	return (
		<Switch size="lg" isSelected={isSelected} onChange={onChange}>
			{({ isSelected }) => (
				<Switch.Control className={isSelected ? "bg-accent" : "bg-default-500"}>
					<Switch.Thumb>
						<Switch.Icon>{isSelected ? "🔔" : "🔕"}</Switch.Icon>
					</Switch.Thumb>
				</Switch.Control>
			)}
		</Switch>
	);
}

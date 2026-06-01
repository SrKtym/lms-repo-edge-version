import { ProgressBar } from "@heroui/react";

// 汎用プログレスバー
export function DefaultProgressBar({
	value,
	...props
}: { value: number } & React.ComponentProps<typeof ProgressBar>) {
	return (
		<ProgressBar
			aria-label="progress"
			color="success"
			value={value}
			className="h-2"
			{...props}
		>
			<ProgressBar.Track>
				<ProgressBar.Fill />
			</ProgressBar.Track>
		</ProgressBar>
	);
}

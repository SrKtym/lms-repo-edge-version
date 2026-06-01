export const CalendarAnimation = ({
	width,
	height,
}: {
	width?: number;
	height?: number;
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		viewBox="0 0 24 24"
	>
		<title>Calendar Animation</title>
		<path
			fill="none"
			stroke="var(--color-primary)"
			strokeDasharray={66}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 4h7c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1v-14c0 -0.55 0.45 -1 1 -1Z"
		>
			<animate
				fill="freeze"
				attributeName="stroke-dashoffset"
				dur="0.6s"
				values="66;0"
			/>
		</path>
		<path fill="var(--color-primary)" d="M5 5h14v0h-14Z">
			<animate
				fill="freeze"
				attributeName="d"
				begin="0.6s"
				dur="0.2s"
				to="M5 5h14v3h-14Z"
			/>
		</path>
		<g
			fill="none"
			stroke="var(--color-primary)"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<path strokeDasharray={4} strokeDashoffset={4} d="M7 4v-2M17 4v-2">
				<animate
					fill="freeze"
					attributeName="stroke-dashoffset"
					begin="0.8s"
					dur="0.2s"
					to={0}
				/>
			</path>
			<path strokeDasharray={12} strokeDashoffset={12} d="M7 11h10">
				<animate
					fill="freeze"
					attributeName="stroke-dashoffset"
					begin="0.8s"
					dur="0.2s"
					to={0}
				/>
			</path>
			<path strokeDasharray={10} strokeDashoffset={10} d="M7 15h7">
				<animate
					fill="freeze"
					attributeName="stroke-dashoffset"
					begin="0.8s"
					dur="0.2s"
					to={0}
				/>
			</path>
		</g>
	</svg>
);

export const Info = ({
	width = 24,
	height = 24,
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
		<title>Info</title>
		<g
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<circle cx={12} cy={12} r={10} />
			<path d="M12 16v-4m0-4h.01" />
		</g>
	</svg>
);

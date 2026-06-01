export const DashBoard = ({
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
		<title>Dashboard</title>
		<g
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<rect width={7} height={9} x={3} y={3} rx={1} />
			<rect width={7} height={5} x={14} y={3} rx={1} />
			<rect width={7} height={9} x={14} y={12} rx={1} />
			<rect width={7} height={5} x={3} y={16} rx={1} />
		</g>
	</svg>
);

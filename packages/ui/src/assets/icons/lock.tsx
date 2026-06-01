export const Lock = ({
	width = 24,
	height = 24,
	className,
}: {
	width?: number;
	height?: number;
	className?: string;
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		className={className}
	>
		<title>Lock</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
		/>
	</svg>
);

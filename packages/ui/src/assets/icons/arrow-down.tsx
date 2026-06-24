export const ArrowDown = ({
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
		viewBox="0 0 24 24"
		className={className}
	>
		<title>Arrow Down</title>
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 14l-7 7m0 0l-7-7m7 7V3"
		/>
	</svg>
);

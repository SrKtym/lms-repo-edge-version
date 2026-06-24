export const MoreVertical = ({
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
		<title>More Vertical</title>
		<g
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<circle cx={12} cy={12} r={1} />
			<circle cx={12} cy={5} r={1} />
			<circle cx={12} cy={19} r={1} />
		</g>
	</svg>
);

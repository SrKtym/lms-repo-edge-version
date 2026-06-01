export const MessagesSquareOff = ({
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
		<title>Messages Square Off</title>
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 19H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 1.184-1.826M2 2l20 20M8.656 3H20a2 2 0 0 1 2 2v11.344"
		/>
	</svg>
);

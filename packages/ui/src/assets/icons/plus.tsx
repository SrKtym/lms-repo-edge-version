export const Plus = ({
	width = 24,
	height = 24,
}: {
	width?: number;
	height?: number;
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="text-gray-400"
		width={width}
		height={height}
		viewBox="0 0 24 24"
	>
		<title>Plus</title>
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M5 12h14m-7-7v14"
		/>
	</svg>
);

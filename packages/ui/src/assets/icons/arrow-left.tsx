export const ArrowLeft = ({
	width,
	height,
}: {
	width?: number;
	height?: number;
}) => (
	<svg
		width={width ?? 24}
		height={height ?? 24}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Arrow Left</title>
		<path
			d="M15 18L9 12L15 6"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

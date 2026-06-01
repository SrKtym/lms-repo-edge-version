export const SquarePlus = ({
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
		<title>Square Plus</title>
		<g
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
		>
			<rect width="18" height="18" x="3" y="3" rx="2" />
			<path d="M8 12h8m-4-4v8" />
		</g>
	</svg>
);

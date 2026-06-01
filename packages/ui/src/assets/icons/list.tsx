export const List = ({
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
		<title>List</title>
		<path
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13"
		/>
	</svg>
);

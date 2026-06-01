export const TrendingUp = ({
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
		<title>Trending Up</title>

		<g
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			{/* メインの線 */}
			<path
				d="M2 17L8.5 10.5L13.5 15.5L22 7"
				strokeDasharray={30}
				strokeDashoffset={30}
			>
				<animate
					attributeName="stroke-dashoffset"
					from="30"
					to="0"
					dur="0.5s"
					fill="freeze"
				/>
			</path>

			{/* 矢印右上 */}
			<path d="M22 7L18 7" strokeDasharray={4} strokeDashoffset={4}>
				<animate
					attributeName="stroke-dashoffset"
					from="4"
					to="0"
					begin="0.5s"
					dur="0.15s"
					fill="freeze"
				/>
			</path>

			{/* 矢印下 */}
			<path d="M22 7L22 11" strokeDasharray={4} strokeDashoffset={4}>
				<animate
					attributeName="stroke-dashoffset"
					from="4"
					to="0"
					begin="0.5s"
					dur="0.15s"
					fill="freeze"
				/>
			</path>
		</g>
	</svg>
);

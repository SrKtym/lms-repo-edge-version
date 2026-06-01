export const FileDocument = ({
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
		<title>File Document</title>
		<g
			stroke="orange"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<path
				fill="none"
				strokeDasharray={62}
				d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"
			>
				<animate
					fill="freeze"
					attributeName="stroke-dashoffset"
					dur="0.6s"
					values="62;0"
				/>
			</path>
			<path fill="orange" d="M14 3.5l0 4.5l4.5 0Z" opacity={0}>
				<set fill="freeze" attributeName="opacity" begin="0.6s" to={1} />
				<animate
					fill="freeze"
					attributeName="d"
					begin="0.6s"
					dur="0.2s"
					values="M14 3.5l2.25 2.25l2.25 2.25Z;M14 3.5l0 4.5l4.5 0Z"
				/>
			</path>
			<g fill="none" stroke="orange">
				<path strokeDasharray={8} strokeDashoffset={8} d="M9 13h6">
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="0.8s"
						dur="0.2s"
						to={0}
					/>
				</path>
				<path strokeDasharray={6} strokeDashoffset={6} d="M9 17h3">
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="1s"
						dur="0.2s"
						to={0}
					/>
				</path>
			</g>
		</g>
	</svg>
);

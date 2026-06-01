import { domAnimation, LazyMotion } from "motion/react";

export function LazyMotionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

import { useEffect, useState } from "react";

export function useIsHoverCapable() {
	const [isHoverCapable, setIsHoverCapable] = useState(false);

	useEffect(() => {
		// Check if the device supports hover using media query
		const mediaQuery = window.matchMedia("(hover: hover)");
		setIsHoverCapable(mediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => {
			setIsHoverCapable(e.matches);
		};

		// Add listener for media query changes
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return isHoverCapable;
}

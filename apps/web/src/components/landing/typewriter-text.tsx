import { useEffect, useState } from "react";

export function TypewriterText({
	texts,
	className = "",
}: {
	texts: string[];
	className?: string;
}) {
	const [displayedText, setDisplayedText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentStringIndex, setCurrentStringIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const currentText = texts[currentStringIndex];
		const handleTyping = () => {
			if (!currentText) return;
			if (!isDeleting && currentIndex < currentText.length) {
				setDisplayedText(currentText.slice(0, currentIndex + 1));
				setCurrentIndex(currentIndex + 1);
			} else if (isDeleting && currentIndex > 0) {
				setDisplayedText(currentText.slice(0, currentIndex - 1));
				setCurrentIndex(currentIndex - 1);
			} else if (currentIndex === currentText.length && !isDeleting) {
				setTimeout(() => setIsDeleting(true), 2000);
			} else if (currentIndex === 0 && isDeleting) {
				setIsDeleting(false);
				setCurrentStringIndex((prev) => (prev + 1) % texts.length);
			}
		};

		const timeout = setTimeout(handleTyping, isDeleting ? 50 : 100);
		return () => clearTimeout(timeout);
	}, [currentIndex, isDeleting, currentStringIndex, texts]);

	return (
		<span className={className}>
			LMS <span className="text-primary">{displayedText}</span>
			<span className="animate-blink">|</span>
		</span>
	);
}

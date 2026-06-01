import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";

interface CurrentTimeIndicatorProps {
	pixelsPerHour: number;
}

export function CurrentTimeIndicator({
	pixelsPerHour,
}: CurrentTimeIndicatorProps) {
	const [currentPosition, setCurrentPosition] = useState<number>(0);
	const elementRef = useRef<HTMLDivElement>(null);
	const [elementHeight, setElementHeight] = useState<number>(0);

	useEffect(() => {
		const delay = (60 - new Date().getSeconds()) * 1000;

		// 指標の高さを取得
		const updateElementHeight = () => {
			if (elementRef.current) {
				const height = elementRef.current.offsetHeight;
				setElementHeight(height);
			}
		};

		// ResizeObserverで高さの変化を監視
		const resizeObserver = new ResizeObserver(() => {
			updateElementHeight();
		});

		if (elementRef.current) {
			resizeObserver.observe(elementRef.current);
		}

		// 1. 指標の位置を計算
		const calculatePosition = () => {
			const now = new Date();
			const hours = now.getHours();
			const minutes = now.getMinutes();
			const timeAsDecimal = hours + minutes / 60;
			const position = timeAsDecimal * pixelsPerHour;

			return position;
		};

		// 2. 初期位置を設定
		setCurrentPosition(calculatePosition());
		updateElementHeight();

		// 3. 分頭に合わせて表示
		const timeout = setTimeout(() => {
			// ポーリングにより每分位置を更新
			const interval = setInterval(() => {
				setCurrentPosition(calculatePosition());
			}, 60000);

			return () => clearInterval(interval);
		}, delay);

		return () => {
			clearTimeout(timeout);
			resizeObserver.disconnect();
		};
	}, [pixelsPerHour]);

	// 位置が範囲(24時間 × gridセルの高さ)外なら表示しない
	if (currentPosition < 0 || currentPosition > 24 * pixelsPerHour) {
		return null;
	}

	return (
		<m.div
			ref={elementRef}
			className="absolute right-0 left-0 z-8 flex items-center"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, top: `${currentPosition - elementHeight / 2}px` }}
			transition={{ type: "spring", stiffness: 80, damping: 30 }}
		>
			<span className="font-medium text-primary text-xs">
				{new Date().toLocaleTimeString("default", {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
			<div className="h-[2px] flex-grow bg-primary/30" />
			<div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
		</m.div>
	);
}

import { useState } from "react";

export interface TimeSlot {
	start: Date;
	end: Date;
}

export const usePeriodTime = () => {
	const [timeSlots] = useState<Record<number, () => TimeSlot>>(() => ({
		1: () => {
			const start = new Date();
			start.setHours(9, 0, 0, 0);
			const end = new Date();
			end.setHours(10, 30, 0, 0);
			return { start, end };
		},
		2: () => {
			const start = new Date();
			start.setHours(10, 40, 0, 0);
			const end = new Date();
			end.setHours(12, 10, 0, 0);
			return { start, end };
		},
		3: () => {
			const start = new Date();
			start.setHours(13, 0, 0, 0);
			const end = new Date();
			end.setHours(14, 30, 0, 0);
			return { start, end };
		},
		4: () => {
			const start = new Date();
			start.setHours(14, 40, 0, 0);
			const end = new Date();
			end.setHours(16, 10, 0, 0);
			return { start, end };
		},
		5: () => {
			const start = new Date();
			start.setHours(16, 20, 0, 0);
			const end = new Date();
			end.setHours(17, 50, 0, 0);
			return { start, end };
		},
	}));

	const periodToTime = (period: number): TimeSlot => {
		const timeSlotFn = timeSlots[period];
		if (timeSlotFn) {
			return timeSlotFn();
		}
		// Default to period 1 if invalid period
		const defaultSlot = timeSlots[1];
		return defaultSlot ? defaultSlot() : { start: new Date(), end: new Date() };
	};

	return { periodToTime };
};

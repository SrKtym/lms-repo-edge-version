import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TIME = {
	MINUTE: 60 * 1000,
	HOUR: 60 * 60 * 1000,
	DAY: 24 * 60 * 60 * 1000,
	WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

export const QUERY_CONFIG = {
	DEFAULT: {
		staleTime: 5 * TIME.MINUTE, // 5分
		gcTime: 10 * TIME.MINUTE, // 10分
	},
	STUDENT_DATA: {
		staleTime: TIME.DAY, // 24時間
		gcTime: 7 * TIME.DAY, // 7日間
	},
	COURSES: {
		staleTime: TIME.HOUR, // 1時間
		gcTime: TIME.DAY, // 1日
	},
	NOTIFICATIONS: {
		staleTime: TIME.MINUTE, // 1分
		gcTime: 5 * TIME.MINUTE, // 5分
	},
} as const;

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: QUERY_CONFIG.DEFAULT,
	},
});

export { QueryClientProvider };

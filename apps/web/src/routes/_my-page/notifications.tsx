import { Check } from "@lms-repo-edge-version/ui/assets/icons/check";
import { Close } from "@lms-repo-edge-version/ui/assets/icons/close";
import { MessagesSquareCheck } from "@lms-repo-edge-version/ui/assets/icons/messages-square-check";
import { MessagesSquareOff } from "@lms-repo-edge-version/ui/assets/icons/messages-square-off";
import { Trash } from "@lms-repo-edge-version/ui/assets/icons/trash";
import {
	DangerButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import { formatTimestamp } from "@lms-repo-edge-version/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import {
	useDeleteNotification,
	useMarkAllNotificationsAsRead,
	useMarkNotificationAsRead,
	useNotifications,
} from "@/hooks/notifications";
import { queryClient } from "@/lib/query-client";
import { fetchNotificationsQueryFn } from "@/utils/query-utils";

export const Route = createFileRoute("/_my-page/notifications")({
	component: RouteComponent,
	loader: async () => {
		const initialNotifications = await queryClient.ensureQueryData({
			queryKey: ["notifications"],
			queryFn: fetchNotificationsQueryFn,
			staleTime: 5 * 60 * 1000, // 5 minutes
		});

		return { initialNotifications };
	},
});

function RouteComponent() {
	const { initialNotifications } = Route.useLoaderData();
	const { data: notifications = [] } = useNotifications(initialNotifications);

	const options = ["all", "unread", "read"] as const;
	const [filter, setFilter] = useState<(typeof options)[number]>("all");

	const [expandedNotifications, setExpandedNotifications] = useState<
		Set<string>
	>(new Set());

	// フィルター適用
	const filteredNotifications = notifications.filter((notification) => {
		if (filter === "unread") return !notification.isRead;
		if (filter === "read") return notification.isRead;
		return true;
	});

	// 未読数
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	// 通知の展開/折りたたみ
	const toggleExpand = (id: string) => {
		const newExpanded = new Set(expandedNotifications);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedNotifications(newExpanded);
	};

	// 通知を既読にする
	const { mutate: markAsRead } = useMarkNotificationAsRead();
	const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

	// 通知を削除
	const { mutate: deleteNotification } = useDeleteNotification();

	return (
		<div className="space-y-6 p-3">
			<LazyMotionProvider>
				{/* ヘッダー */}
				<m.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div>
						<h2 className="font-bold text-2xl text-gray-900 dark:text-white">
							通知
						</h2>
						<p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
							{unreadCount > 0 && `${unreadCount}件の未読通知`}
						</p>
					</div>
					<div className="flex items-center space-x-2">
						{unreadCount > 0 && (
							<DefaultButton onPress={() => markAllAsRead}>
								<MessagesSquareCheck />
								すべて既読
							</DefaultButton>
						)}
						{notifications.length > 0 && (
							<DangerButton
								onPress={() => console.log("delete all notifications")}
							>
								<Trash />
								すべて削除
							</DangerButton>
						)}
					</div>
				</m.div>

				{/* フィルター */}
				<m.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="flex items-center space-x-2"
				>
					{options.map((filterType) => (
						<m.button
							key={filterType}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setFilter(filterType)}
							className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
								filter === filterType
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							}`}
						>
							{filterType === "all" && "すべて"}
							{filterType === "unread" && "未読"}
							{filterType === "read" && "既読"}
						</m.button>
					))}
				</m.div>

				{/* 通知リスト */}
				<div className="space-y-3">
					<AnimatePresence mode="popLayout">
						{filteredNotifications.length > 0 ? (
							filteredNotifications.map((notification, index) => (
								<m.div
									key={notification.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3, delay: index * 0.05 }}
									className={`rounded-lg border p-4 transition-all ${
										notification.isRead
											? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
											: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
									}`}
									onClick={() => {
										if (!notification.isRead) {
											markAsRead(notification.id);
										}
										toggleExpand(notification.id);
									}}
								>
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-3">
											{/* <div
												className={`rounded-full p-2 ${getNotificationStyle(notification.type)}`}
											>
												{getNotificationIcon(notification.type)}
											</div> */}
											<div className="flex-1">
												<div className="flex items-center space-x-2">
													<h3 className="font-semibold text-gray-900 dark:text-white">
														{notification.title}
													</h3>
													{!notification.isRead && (
														<span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
													)}
												</div>
												<p className="mt-1 whitespace-pre-wrap text-gray-600 text-sm dark:text-gray-400">
													{notification.description}
												</p>
												<p className="mt-2 text-gray-500 text-xs dark:text-gray-500">
													{formatTimestamp(notification.createdAt)}
												</p>
												{/* {expandedNotifications.has(notification.id) && (
													<m.div
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: "auto" }}
														exit={{ opacity: 0, height: 0 }}
														transition={{ duration: 0.2 }}
														className="mt-3"
													>
														<m.button
															whileHover={{ scale: 1.05 }}
															whileTap={{ scale: 0.95 }}
															onClick={(e) => {
																e.stopPropagation();
															}}
															className="rounded-lg bg-blue-500 px-3 py-1 font-medium text-sm text-white transition-colors hover:bg-blue-600"
														>
															テスト
														</m.button>
													</m.div>
												)} */}
											</div>
										</div>
										<div className="flex items-center space-x-2">
											{!notification.isRead && (
												<m.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													onClick={(e) => {
														e.stopPropagation();
														markAsRead(notification.id);
													}}
													className="rounded-full p-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
												>
													<Check width={18} height={18} />
												</m.button>
											)}
											<m.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												onClick={(e) => {
													e.stopPropagation();
													deleteNotification(notification.id);
												}}
												className="rounded-full p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
											>
												<Close width={18} height={18} />
											</m.button>
										</div>
									</div>
								</m.div>
							))
						) : (
							<m.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
								className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800"
							>
								<div className="space-y-4">
									<div className="mx-auto h-12 w-12 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
										<MessagesSquareOff className="text-gray-400 dark:text-gray-500" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 dark:text-white">
											{filter === "unread"
												? "未読通知がありません"
												: filter === "read"
													? "既読通知がありません"
													: "通知がありません"}
										</h3>
										<p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
											{filter === "unread"
												? "新しい通知はありません"
												: filter === "read"
													? "既読の通知はありません"
													: "新しい通知はまだありません"}
										</p>
									</div>
								</div>
							</m.div>
						)}
					</AnimatePresence>
				</div>
			</LazyMotionProvider>
		</div>
	);
}

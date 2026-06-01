import type { FetchNotificationsReturnType } from "@lms-repo-edge-version/db/utils/query/notifications";
import { BellAnimation } from "@lms-repo-edge-version/ui/assets/icons/bell-animation";
import { Close } from "@lms-repo-edge-version/ui/assets/icons/close";
import { formatTimestamp } from "@lms-repo-edge-version/ui/lib/utils";
import {
	AnimatePresence,
	domAnimation,
	LayoutGroup,
	LazyMotion,
} from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import { DefaultButton } from "../button";
import { BaseCard } from "../cards/base-card";
import { NotificationsModal } from "../modals/notifications-modal";

interface NotificationsListCardProps {
	notifications: FetchNotificationsReturnType;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	deleteNotification: (id: string) => void;
}

export function NotificationsListCard({
	notifications,
	markAsRead,
	markAllAsRead,
	deleteNotification,
}: NotificationsListCardProps) {
	const [selectedNotification, setSelectedNotification] = useState<
		string | null
	>(null);
	// const getNotificationIcon = (type: string) => {
	// 	switch (type) {
	// 		case "課題":
	// 			return "📝";
	// 		case "アンケート":
	// 			return "💬";
	// 		case "資料":
	// 			return "📚";
	// 		case "システム":
	// 			return "⚙️";
	// 		default:
	// 			return "📢";
	// 	}
	// };

	// const getPriorityColor = (priority: string) => {
	// 	switch (priority) {
	// 		case "high":
	// 			return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950";
	// 		case "medium":
	// 			return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950";
	// 		case "low":
	// 			return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950";
	// 		default:
	// 			return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900";
	// 	}
	// };

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<LazyMotion features={domAnimation}>
			<LayoutGroup>
				<>
					<BaseCard className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-purple-50/30 shadow-lg backdrop-blur-sm dark:from-gray-800 dark:to-purple-900/20">
						{/* Decorative background elements */}
						<div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-2xl" />
						<div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-tr from-pink-400/10 to-purple-400/10 blur-xl" />

						<div className="relative z-10">
							<div className="sticky top-0 z-10 border-b p-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<BellAnimation width={24} height={24} />
										<h1 className="font-semibold text-lg">通知</h1>
										{unreadCount > 0 && (
											<span className="rounded-full bg-red-500 px-2 py-1 font-medium text-white text-xs">
												{unreadCount}
											</span>
										)}
									</div>
									{unreadCount > 0 && (
										<DefaultButton size="sm" onPress={markAllAsRead}>
											すべて既読
										</DefaultButton>
									)}
								</div>
							</div>

							<div className="max-h-[480px] overflow-y-auto">
								{notifications.length === 0 ? (
									<m.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										className="relative flex h-full flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400"
									>
										<div className="relative z-10">
											<p className="font-medium">通知はありません</p>
											<p className="mt-1 text-sm">
												新しい通知がここに表示されます
											</p>
										</div>
									</m.div>
								) : (
									<m.div
										className="space-y-3 p-4"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<AnimatePresence initial={false} mode="popLayout">
											{notifications.map((notification) => (
												<m.div
													key={notification.id}
													layoutId={notification.id.toString()}
													layout
													initial={{ opacity: 0, y: 50, scale: 0.3 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													transition={{ duration: 0.3 }}
													exit={{
														opacity: 0,
														scale: 0.5,
													}}
													whileHover={{ scale: 1.02 }}
													className={`relative cursor-pointer rounded-lg border p-3 transition-all dark:border-gray-700 ${
														!notification.isRead ? "font-semibold" : ""
													} bg-gradient-to-r from-white to-purple-50/50 hover:shadow-md dark:from-gray-800 dark:to-purple-900/30`}
													onClick={() => {
														markAsRead(notification.id);
														setSelectedNotification(notification.id);
													}}
												>
													<div className="flex items-start gap-3">
														{/* <span className="mt-1 flex-shrink-0 text-base">
															{getNotificationIcon(notification.type)}
														</span> */}
														<div className="min-w-0 flex-1">
															<div className="mb-1 flex items-center justify-between gap-2">
																<h3 className="truncate font-medium text-gray-900 text-xs dark:text-gray-100">
																	{notification.title}
																</h3>
																<span className="flex-shrink-0 text-gray-500 text-xs dark:text-gray-400">
																	{formatTimestamp(notification.createdAt)}
																</span>
															</div>
															<p className="line-clamp-2 whitespace-pre-wrap text-gray-600 text-xs dark:text-gray-400">
																{notification.description}
															</p>
														</div>
													</div>

													{!notification.isRead && (
														<div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500" />
													)}
													<m.button
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
														onClick={(e) => {
															e.stopPropagation();
															deleteNotification(notification.id);
														}}
														className="absolute right-1 bottom-1 rounded-full p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
													>
														<Close width={18} height={18} />
													</m.button>
												</m.div>
											))}
										</AnimatePresence>
									</m.div>
								)}
							</div>
						</div>
					</BaseCard>

					{/* Notification Modal */}
					<NotificationsModal
						notification={
							notifications.find((n) => n.id === selectedNotification) || null
						}
						onClose={() => setSelectedNotification(null)}
						onDelete={deleteNotification}
					/>
				</>
			</LayoutGroup>
		</LazyMotion>
	);
}

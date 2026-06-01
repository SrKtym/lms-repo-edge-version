import type { FetchNotificationsReturnType } from "@lms-repo-edge-version/db/utils/query/notifications";
import { Close } from "@lms-repo-edge-version/ui/assets/icons/close";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { formatTimestamp } from "@lms-repo-edge-version/ui/lib/utils";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

interface NotificationModalProps {
	notification: FetchNotificationsReturnType[number] | null;
	onClose: () => void;
	onDelete: (id: string) => void;
}

export function NotificationsModal({
	notification,
	onClose,
	onDelete,
}: NotificationModalProps) {
	return (
		<AnimatePresence>
			{notification && (
				<>
					{/* Backdrop */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50"
						onClick={onClose}
					/>

					{/* Modal */}
					<m.div
						layoutId={notification.id.toString()}
						className="fixed top-1/2 left-1/2 z-[60] max-h-[80vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white/90 shadow-2xl backdrop-blur-sm dark:bg-gray-800/90"
						style={{ margin: 0 }}
					>
						<div className="flex h-full flex-col">
							{/* Modal Header */}
							<div className="flex items-center justify-between border-b p-6 dark:border-gray-700">
								<div className="flex items-center gap-3">
									{/* <span className="text-2xl">
										{getNotificationIcon(notification.type)}
									</span> */}
									<div>
										<h2 className="font-semibold text-gray-900 text-lg dark:text-gray-100">
											{notification.title}
										</h2>
										<p className="text-gray-500 text-sm dark:text-gray-400">
											{formatTimestamp(notification.createdAt)}
										</p>
									</div>
								</div>
								<CancelButton
									aria-label="close modal"
									isIconOnly
									onPress={onClose}
								>
									<Close />
								</CancelButton>
							</div>

							{/* Modal Content */}
							<div className="flex-1 overflow-y-auto p-6">
								<div className="prose dark:prose-invert max-w-none">
									<p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
										{notification.description}
									</p>
								</div>

								{/* Additional Actions */}
								<div className="mt-6 flex gap-3">
									<DefaultButton
										onPress={() => {
											onDelete(notification.id);
											onClose();
										}}
									>
										削除
									</DefaultButton>
									<CancelButton onPress={onClose}>閉じる</CancelButton>
								</div>
							</div>
						</div>
					</m.div>
				</>
			)}
		</AnimatePresence>
	);
}

import { Input } from "@heroui/react";
import { Close } from "@lms-repo-edge-version/ui/assets/icons/close";
import { CloudUpload } from "@lms-repo-edge-version/ui/assets/icons/cloud-upload";
import { Download } from "@lms-repo-edge-version/ui/assets/icons/download";
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useState } from "react";
import { DefaultAvatar } from "../avatar";
import { CancelButton, DefaultButton } from "../button";
import { BaseCard } from "../cards/base-card";

export interface UploadedFile {
	id: string;
	name: string;
	size: number;
	type: string;
	objectName?: string;
}

interface FileUploaderCardProps {
	uploadedFiles?: UploadedFile[];
	onFilesChange?: (files: UploadedFile[]) => void;
	onFileSelect?: (files: File[]) => void;
	onDownload?: (file: UploadedFile) => void;
	onDelete?: (file: UploadedFile) => void;
	disabled?: boolean;
	className?: string;
}

export function FileUploaderCard({
	uploadedFiles = [],
	onFilesChange,
	onFileSelect,
	onDownload,
	onDelete,
	disabled = false,
	className = "",
}: FileUploaderCardProps) {
	const maxSize = 10;
	const maxFiles = 5;
	const accept =
		"application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";

	const [isDragOver, setIsDragOver] = useState(false);

	// ファイルサイズ表示のフォーマッター
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
	};

	// ファイル選択時の処理
	const handleFileSelect = useCallback(
		(selectedFiles: FileList | null) => {
			if (!selectedFiles || disabled) return;

			const fileArray = Array.from(selectedFiles).slice(
				0,
				maxFiles - uploadedFiles.length,
			);

			const newFiles: UploadedFile[] = fileArray.map((file) => ({
				id: Math.random().toString(36).substring(2, 9),
				name: file.name,
				size: file.size,
				type: file.type,
			}));

			onFilesChange?.([...uploadedFiles, ...newFiles]);
			onFileSelect?.(fileArray);
		},
		[uploadedFiles, disabled, onFilesChange, onFileSelect],
	);

	// ドラッグオーバー時の処理
	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			if (!disabled) {
				setIsDragOver(true);
			}
		},
		[disabled],
	);

	// ドラッグリーブ時の処理
	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	// ファイルドロップ時の処理
	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);
			if (!disabled) {
				handleFileSelect(e.dataTransfer.files);
			}
		},
		[disabled, handleFileSelect],
	);

	// ファイル削除時の処理
	const removeFile = useCallback(
		(id: string) => {
			const file = uploadedFiles.find((f) => f.id === id);
			if (file && onDelete) {
				onDelete(file);
			}
			const newFiles = uploadedFiles.filter((file) => file.id !== id);
			onFilesChange?.(newFiles);
		},
		[uploadedFiles, onFilesChange, onDelete],
	);

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className={className}
			>
				<div
					className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
						isDragOver
							? "border-blue-500 bg-blue-50 dark:bg-blue-950"
							: "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
					} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() =>
						!disabled && document.getElementById("file-input")?.click()
					}
				>
					<BaseCard className="border-0">
						<Input
							id="file-input"
							type="file"
							multiple
							accept={accept}
							onChange={(e) => handleFileSelect(e.target.files)}
							disabled={disabled}
							className="hidden"
						/>
						<div className="p-8 text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
								<CloudUpload />
							</div>
							<p className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">
								{isDragOver
									? "ここにファイルをドロップ"
									: "ファイルのアップロード"}
							</p>
							<p className="text-gray-600 text-sm dark:text-gray-400">
								クリックまたはドラッグしてファイルをアップロードしてください
							</p>
							<p className="text-gray-500 text-xs dark:text-gray-500">
								・最大 {maxFiles} ファイルまで
								<br />
								・ファイルサイズ {maxSize}MB まで
								<br />
								・PDF, DOC, XLS, PPTファイルのみ
							</p>
						</div>
					</BaseCard>
				</div>

				{/* File list */}
				<AnimatePresence>
					{uploadedFiles.length > 0 && (
						<m.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="mt-4 space-y-2"
						>
							{uploadedFiles.map((file) => (
								<m.div
									key={file.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									className="flex items-center gap-3 rounded-lg border p-3 dark:border-gray-700"
								>
									<DefaultAvatar />
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-gray-900 dark:text-gray-100">
											{file.name}
										</p>
										<p className="text-gray-600 text-sm dark:text-gray-400">
											{formatFileSize(file.size)}
										</p>
									</div>
									<div className="flex items-center gap-2">
										{onDownload && (
											<DefaultButton
												isIconOnly
												onPress={() => onDownload(file)}
												className="rounded bg-transparent p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
												aria-label="ダウンロード"
											>
												<Download />
											</DefaultButton>
										)}
										<CancelButton
											isIconOnly
											onPress={() => removeFile(file.id)}
											className="rounded bg-transparent p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
										>
											<Close />
										</CancelButton>
									</div>
								</m.div>
							))}
						</m.div>
					)}
				</AnimatePresence>

				{/* Actions */}
				{uploadedFiles.length > 0 && (
					<m.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1 }}
						className="mt-4 flex justify-end gap-2"
					>
						<CancelButton onPress={() => onFilesChange?.([])}>
							すべて削除
						</CancelButton>
					</m.div>
				)}
			</m.div>
		</LazyMotion>
	);
}

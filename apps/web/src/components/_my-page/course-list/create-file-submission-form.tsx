import {
	FileUploaderCard,
	type UploadedFile,
} from "@lms-repo-edge-version/ui/components/cards/file-uploader-card";
import { toast } from "@lms-repo-edge-version/ui/components/toast";
import { useEffect, useState } from "react";
import {
	useDeleteFile,
	useDownloadUrl,
	useFileSubmissions,
	useSubmitMultipleFiles,
} from "@/hooks/submissions";

export function CreateFileSubmissionForm({
	assignmentId,
}: {
	assignmentId: string;
}) {
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const { mutateAsync: submitMultipleFiles, isPending } =
		useSubmitMultipleFiles();
	const { data: serverFiles } = useFileSubmissions();
	const { mutateAsync: getDownloadUrl } = useDownloadUrl();
	const { mutateAsync: deleteFile } = useDeleteFile();

	// サーバーからファイルメタデータを取得して初期化
	useEffect(() => {
		if (serverFiles && serverFiles.length > 0) {
			const convertedFiles: UploadedFile[] = serverFiles.map((file) => ({
				id: file.id,
				name: file.originalName,
				size: file.fileSize,
				type: file.mimeType,
				url: undefined, // ダウンロード時に署名付きURLを取得
				objectName: file.objectName,
				uploadProgress: 100,
			}));
			setUploadedFiles(convertedFiles);
		}
	}, [serverFiles]);

	// ファイルダウンロード処理
	const handleDownload = async (file: UploadedFile) => {
		if (!file.objectName) return;

		try {
			const result = await getDownloadUrl(file.objectName);

			if (result.isDirect) {
				// 開発環境：Blob URLを使用してダウンロード
				const a = document.createElement("a");
				a.href = result.url;
				a.download = file.name;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(result.url);
			} else {
				// 本番環境：署名付きURLを新しいタブで開く
				window.open(result.url, "_blank");
			}
		} catch (error) {
			toast.danger("ダウンロードに失敗しました", {
				description:
					error instanceof Error
						? error.message
						: "予期しないエラーが発生しました",
			});
		}
	};

	// ファイル削除処理
	const handleDelete = async (file: UploadedFile) => {
		// サーバーからロードしたファイル（objectNameがある＝UUIDを持つ）のみAPIで削除
		if (file.objectName) {
			try {
				const res = await deleteFile(file.id);
				if ("message" in res) {
					toast.success("ファイルを削除しました", {
						description: res.message,
					});
				} else if ("error" in res) {
					toast.danger("ファイルの削除に失敗しました", {
						description: res.error,
					});
					return;
				}
			} catch {
				toast.danger("ファイルの削除に失敗しました", {
					description: "予期しないエラーが発生しました",
				});
				return;
			}
		}

		// ローカル状態から削除
		setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
	};

	// ファイル選択時に新規ファイルをアップロード処理する
	const onFilesChange = async (files: UploadedFile[]) => {
		if (files.length === 0 || isPending) {
			return;
		}

		// 新規ファイルのみをフィルタリング
		const newFiles = files.filter(
			(file) => !uploadedFiles.some((f) => f.name === file.name),
		);

		if (newFiles.length === 0) {
			return;
		}

		// UploadedFileからFileオブジェクトを再構築
		const fileObjects = newFiles.map((file) => {
			return new File([file.name], file.name, { type: file.type });
		});

		try {
			// アップロード処理
			const res = await submitMultipleFiles({
				files: fileObjects,
				assignmentId,
			});

			if ("error" in res) {
				toast.danger("ファイルの提出に失敗しました", {
					description: res.error,
				});
			} else if ("message" in res) {
				toast.danger(res.message);
			} else {
				// アップロード完了したファイルをUUID付きで追加
				const uploadedFiles = (res as any).files || [];
				const convertedFiles: UploadedFile[] = uploadedFiles.map(
					(file: any) => ({
						id: file.id,
						name: file.originalName,
						size: file.fileSize,
						type: file.mimeType,
						url: undefined,
						objectName: file.objectName,
						uploadProgress: 100,
					}),
				);
				setUploadedFiles((prev) => [...prev, ...convertedFiles]);
			}
		} catch {
			toast.danger("ファイルの提出に失敗しました", {
				description:
					"予期しないエラーが発生しました。お手数ですが再度試行してください。",
			});
		}
	};

	return (
		<div className="space-y-4">
			<FileUploaderCard
				uploadedFiles={uploadedFiles}
				onFilesChange={onFilesChange}
				onDownload={handleDownload}
				onDelete={handleDelete}
				disabled={isPending}
			/>
			{isPending && (
				<div className="text-center text-gray-600 dark:text-gray-400">
					アップロード中...
				</div>
			)}
		</div>
	);
}

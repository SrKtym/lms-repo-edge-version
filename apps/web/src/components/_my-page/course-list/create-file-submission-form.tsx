import {
	FileUploaderCard,
	type UploadedFile,
} from "@lms-repo-edge-version/ui/components/cards/file-uploader-card";
import { useState } from "react";
import { useSubmitMultipleFiles } from "@/hooks/submissions";

interface CreateFileSubmissionFormProps {
	assignmentId: string;
	onSubmitSuccess?: () => void;
}

export function CreateFileSubmissionForm({
	assignmentId,
	onSubmitSuccess,
}: CreateFileSubmissionFormProps) {
	const allowedType =
		"application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
	const [isPending, setIsPending] = useState(false);
	const [uploadedFileNames, setUploadedFileNames] = useState<Set<string>>(
		new Set(),
	);
	const { mutate: submitMultipleFiles } = useSubmitMultipleFiles();

	// ファイル選択時に新規ファイルをアップロード処理する
	const onFilesChange = async (files: UploadedFile[]) => {
		if (files.length === 0 || isPending) {
			return;
		}

		// 新規ファイルのみをフィルタリング
		const newFiles = files.filter((file) => !uploadedFileNames.has(file.name));

		if (newFiles.length === 0) {
			return;
		}

		// UploadedFileからFileオブジェクトを再構築
		const fileObjects = newFiles.map((file) => {
			return new File([file.name], file.name, { type: file.type });
		});

		setIsPending(true);

		try {
			submitMultipleFiles({
				files: fileObjects,
				assignmentId,
			});

			// アップロード完了したファイル名を記録
			setUploadedFileNames((prev) => {
				const newSet = new Set(prev);
				newFiles.forEach((file) => {
					newSet.add(file.name);
				});
				return newSet;
			});

			onSubmitSuccess?.();
		} catch (error) {
			console.error("ファイルの提出に失敗しました:", error);
			alert("ファイルの提出に失敗しました");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className="space-y-4">
			<FileUploaderCard
				maxFiles={5}
				maxSize={10}
				accept={allowedType}
				onFilesChange={onFilesChange}
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

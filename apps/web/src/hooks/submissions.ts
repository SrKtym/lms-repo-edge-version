import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/hono-client";
import { queryClient } from "@/lib/query-client";

// テキスト提出のフック
export const useCreateTextSubmission = () => {
	return useMutation({
		mutationFn: async (submissionData: {
			title: string;
			description: string;
		}) => {
			const res = await client.api.submissions.text.$post({
				json: submissionData,
			});
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["text-submissions"] });
		},
	});
};

// 複数ファイルアップロードのフック（n+1問題回避版）
export const useSubmitMultipleFiles = () => {
	return useMutation({
		mutationFn: async ({
			files,
			assignmentId,
		}: {
			files: File[];
			assignmentId: string;
		}) => {
			// エミュレータ環境かどうかを判定（環境変数などで判断）
			// 開発環境では直接アップロードエンドポイントを使用
			const isEmulator = import.meta.env.DEV;

			if (isEmulator) {
				// エミュレータ環境：直接アップロードエンドポイントを使用
				const uploadPromises = files.map(async (file) => {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("fileName", file.name);

					const uploadRes = await fetch(
						"http://localhost:3000/api/submissions/upload",
						{
							method: "POST",
							body: formData,
							credentials: "include",
						},
					);

					if (!uploadRes.ok) {
						throw new Error(`${file.name}のアップロードに失敗しました`);
					}

					return uploadRes.json();
				});

				const uploadedMetadata = await Promise.all(uploadPromises);

				// メタデータを一括保存
				const metadataRes = await client.api.submissions.metadata.$post({
					json: {
						metadataList: uploadedMetadata,
						assignmentId,
					},
				});

				return metadataRes.json();
			}
			// 本番環境：署名付きURLを使用
			// 1. 署名付きURLを一括取得（1回のAPIリクエスト）
			const signedUrlsRes = await client.api.submissions.signed_urls.$post({
				json: files.map((file) => ({
					fileName: file.name,
					fileType: file.type,
				})),
			});
			const signedUrls = await signedUrlsRes.json();

			// 2. Cloud Storageにファイルを並列アップロード
			const uploadPromises = signedUrls.map(
				async ({ fileName, signedUrl, objectName }) => {
					const file = files.find((f) => f.name === fileName);
					if (!file) throw new Error(`ファイル ${fileName} が見つかりません`);

					const uploadRes = await fetch(signedUrl, {
						method: "PUT",
						body: file,
						headers: {
							"Content-Type": file.type,
						},
					});

					if (!uploadRes.ok) {
						throw new Error(`${file.name}のアップロードに失敗しました`);
					}

					return {
						objectName,
						originalName: file.name,
						mimeType: file.type,
						fileSize: file.size,
					};
				},
			);

			const uploadedMetadata = await Promise.all(uploadPromises);

			// 3. メタデータを一括保存（1回のAPIリクエスト）
			const metadataRes = await client.api.submissions.metadata.$post({
				json: {
					metadataList: uploadedMetadata,
					assignmentId,
				},
			});

			return metadataRes.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["file-submissions"] });
		},
	});
};

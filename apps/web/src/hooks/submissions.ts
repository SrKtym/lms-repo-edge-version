import { useMutation, useQuery } from "@tanstack/react-query";
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

				if (!Array.isArray(uploadedMetadata)) {
					throw new Error("ファイルのアップロードに失敗しました");
				}

				// メタデータを一括保存
				const metadataRes = await client.api.submissions.metadata.$post({
					json: {
						metadataList: uploadedMetadata as Array<{
							objectName: string;
							originalName: string;
							mimeType: string;
							fileSize: number;
						}>,
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
					fileSize: file.size,
				})),
			});
			const signedUrls = await signedUrlsRes.json();

			if (!Array.isArray(signedUrls)) {
				throw new Error("署名付きURLの取得に失敗しました");
			}

			// 2. Cloud Storageにファイルを並列アップロード
			const uploadPromises = signedUrls.map(
				async (item: {
					fileName: string;
					signedUrl: string;
					objectName: string;
				}) => {
					const { fileName, signedUrl, objectName } = item;
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

// ユーザーのファイル提出メタデータを取得
export const useFileSubmissions = () => {
	return useQuery({
		queryKey: ["file-submissions"],
		queryFn: async () => {
			const res = await client.api.submissions.files.$get();
			return res.json();
		},
	});
};

// ファイルダウンロード用の署名付きURLを取得
export const useDownloadUrl = () => {
	return useMutation({
		mutationFn: async (objectName: string) => {
			const isDev = import.meta.env.DEV;

			if (isDev) {
				// 開発環境：直接ダウンロードエンドポイントを使用
				const res = await fetch(
					`http://localhost:3000/api/submissions/download?objectName=${encodeURIComponent(objectName)}`,
					{
						credentials: "include",
					},
				);

				if (!res.ok) {
					throw new Error("ファイルのダウンロードに失敗しました");
				}

				const blob = await res.blob();
				const url = window.URL.createObjectURL(blob);
				return { url, isDirect: true };
			} else {
				// 本番環境：署名付きURLを使用
				const res = await client.api.submissions.download_url.$post({
					json: { objectName },
				});
				const data = await res.json();

				if ("error" in data) {
					throw new Error(data.error);
				}

				return { url: data.signedUrl, isDirect: false };
			}
		},
	});
};

// ファイル削除
export const useDeleteFile = () => {
	return useMutation({
		mutationFn: async (fileId: string) => {
			const res = await client.api.submissions[":fileId"].$delete({
				param: { fileId },
			});
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["file-submissions"] });
		},
	});
};

import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo-edge-version/auth/server";
import type { TextSubmissions } from "@lms-repo-edge-version/db/types";
import {
	createFileSubmissionMetadata,
	createTextSubmission,
	deleteFileSubmissionMetadata,
	updateSubmissionStatus,
} from "@lms-repo-edge-version/db/utils/mutation/submissions";
import {
	fetchFileSubmissionById,
	fetchFileSubmissionsByUser,
	fetchSubmissionById,
	fetchSubmissionsFromUserCourses,
} from "@lms-repo-edge-version/db/utils/query/submissions";
import { env } from "@lms-repo-edge-version/env/server";
import { Hono } from "hono";
import { z } from "zod";

// ファイルアップロードの制限
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_COUNT = 5;
const ALLOWED_MIME_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.ms-excel",
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export const submissionsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
	// 署名付きURL生成エンドポイント
	.post(
		"/signed_urls",
		zValidator(
			"json",
			z.array(
				z.object({
					fileName: z.string(),
					fileType: z.string(),
				}),
			),
		),
		async (c) => {
			const files = c.req.valid("json");

			// R2 API credentialsが設定されているか確認
			if (
				!env.R2_ACCESS_KEY_ID ||
				!env.R2_SECRET_ACCESS_KEY ||
				!env.R2_ACCOUNT_ID
			) {
				return c.json(
					{
						error: "R2 API credentials are not configured",
					},
					500,
				);
			}

			// S3クライアントを初期化
			const s3Client = new S3Client({
				region: "auto",
				endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
				credentials: {
					accessKeyId: env.R2_ACCESS_KEY_ID,
					secretAccessKey: env.R2_SECRET_ACCESS_KEY,
				},
			});

			// 署名付きURLを一括生成
			const signedUrls = await Promise.all(
				files.map(async (file) => {
					const key = `uploads/${file.fileName}`;
					const command = new PutObjectCommand({
						Bucket: "storage",
						Key: key,
						ContentType: file.fileType,
					});

					const signedUrl = await getSignedUrl(s3Client, command, {
						expiresIn: 3600, // 1時間有効
					});

					return {
						fileName: file.fileName,
						signedUrl,
						objectName: key,
					};
				}),
			);

			return c.json(signedUrls);
		},
	)
	// 直接アップロードエンドポイント
	.post("/upload", async (c) => {
		const formData = await c.req.formData();
		const file = formData.get("file");
		const fileName = formData.get("fileName") as string;

		if (!file || typeof file !== "object" || !fileName) {
			return c.json({ error: "Missing file or fileName" }, 400);
		}

		// R2バケットに直接アップロード
		const key = `uploads/${fileName}`;
		const buffer = await (file as File).arrayBuffer();
		await env.STORAGE_BUCKET.put(key, buffer, {
			httpMetadata: {
				contentType: (file as File).type,
			},
		});

		return c.json({
			objectName: key,
			originalName: fileName,
			mimeType: (file as File).type,
			fileSize: (file as File).size,
		});
	})
	// ファイルメタデータの一括保存（複数ファイルアップロード用）
	.post(
		"/metadata",
		zValidator(
			"json",
			z.object({
				metadataList: z
					.array(
						z.object({
							objectName: z.string(),
							originalName: z.string(),
							mimeType: z.string(),
							fileSize: z
								.number()
								.max(
									MAX_FILE_SIZE,
									"ファイルサイズは10MB以下である必要があります",
								),
						}),
					)
					.max(
						MAX_FILE_COUNT,
						`一度にアップロードできるファイルは${MAX_FILE_COUNT}個までです`,
					),
				assignmentId: z.string(),
			}),
		),
		async (c) => {
			const { userId } = c.get("session");
			const { metadataList, assignmentId } = c.req.valid("json");

			// MIMEタイプの検証
			for (const metadata of metadataList) {
				if (!ALLOWED_MIME_TYPES.includes(metadata.mimeType)) {
					return c.json(
						{
							error: `許可されていないファイルタイプです: ${metadata.mimeType}`,
							allowedTypes: ALLOWED_MIME_TYPES,
						},
						400,
					);
				}
			}

			// メタデータを一括保存
			const results = await Promise.all(
				metadataList.map(async (metadata) => {
					const result = await createFileSubmissionMetadata({
						bucket: "storage",
						...metadata,
						createdBy: userId,
					});
					return result;
				}),
			);

			// 提出状況を更新
			const updateResult = await updateSubmissionStatus(
				assignmentId,
				userId,
				"提出済み",
			);
			if (updateResult.status !== 200) {
				return c.json(updateResult);
			}

		// 保存したメタデータを返す（UUIDを含む）
		const savedMetadata = await fetchFileSubmissionsByUser(userId);
		const uploadedFiles = savedMetadata.filter((m) =>
			metadataList.some((meta) => meta.objectName === m.objectName),
		);

		return c.json({ successCount: results.length, results, files: uploadedFiles }, 201);
	})
	// 課題の提出（テキスト形式）
	.post(
		"/text",
		zValidator("json", z.custom<Omit<TextSubmissions, "createdBy">>()),
		async (c) => {
			const { userId } = c.get("session");
			const { title, description } = c.req.valid("json");

			const result = await createTextSubmission({
				title,
				description,
				createdBy: userId,
			});
			return c.json(result, 201);
		},
	)
	// 課題提出状況の取得
	.get("/", async (c) => {
		const { userId } = c.get("session");
		const submissions = await fetchSubmissionsFromUserCourses(userId);
		return c.json(submissions, 200);
	})
	// 特定の課題提出状況の取得
	.get("/:assignmentId", async (c) => {
		const { userId } = c.get("session");
		const assignmentId = c.req.param("assignmentId");
		const submission = await fetchSubmissionById(userId, assignmentId);
		return c.json(submission, 200);
	})
	// ユーザーのファイル提出メタデータを取得
	.get("/files", async (c) => {
		const { userId } = c.get("session");
		const files = await fetchFileSubmissionsByUser(userId);
		return c.json(files, 200);
	})
	// ファイルダウンロード用の署名付きURLを取得
	.post("/download_url", async (c) => {
		const { objectName } = await c.req.json();

		if (
			!env.R2_ACCESS_KEY_ID ||
			!env.R2_SECRET_ACCESS_KEY ||
			!env.R2_ACCOUNT_ID
		) {
			return c.json({ error: "R2 credentials not configured" }, 500);
		}

		const s3Client = new S3Client({
			region: "auto",
			endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId: env.R2_ACCESS_KEY_ID,
				secretAccessKey: env.R2_SECRET_ACCESS_KEY,
			},
		});

		const command = new GetObjectCommand({
			Bucket: "storage",
			Key: objectName,
		});

		const signedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600,
		});

		return c.json({ signedUrl });
	})
	// ファイルダウンロード（開発環境用）
	.get("/download", async (c) => {
		const objectName = c.req.query("objectName");
		if (!objectName) {
			return c.json({ error: "Missing objectName parameter" }, 400);
		}

		const object = await env.STORAGE_BUCKET.get(objectName);
		if (!object) {
			return c.json({ error: "File not found" }, 404);
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set("etag", object.httpEtag);

		return new Response(object.body, { headers });
	})
	// ファイル削除
	.delete("/:fileId", async (c) => {
		const fileId = c.req.param("fileId");

		// ファイルメタデータを取得
		const file = await fetchFileSubmissionById(fileId);

		if (!file) {
			return c.json({ error: "File not found" }, 404);
		}

		// ストレージからファイルを削除
		try {
			await env.STORAGE_BUCKET.delete(file.objectName);
		} catch (error) {
			console.error("Failed to delete file from storage:", error);
		}

		// データベースからメタデータを削除
		const result = await deleteFileSubmissionMetadata(fileId);

		if (result.status === 200) {
			return c.json({ message: result.message }, 200);
		}
		return c.json({ error: result.message }, 500);
	});

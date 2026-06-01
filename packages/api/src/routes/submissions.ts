import { zValidator } from "@hono/zod-validator";
import type { Session } from "@lms-repo-edge-version/auth/server";
import { createDb } from "@lms-repo-edge-version/db";
import { submissionStatus } from "@lms-repo-edge-version/db/schema/service";
import type { TextSubmissions } from "@lms-repo-edge-version/db/types";
import {
	createFileSubmissionMetadata,
	createTextSubmission,
} from "@lms-repo-edge-version/db/utils/mutation/submissions";
import {
	fetchSubmissionById,
	fetchSubmissionsFromUserCourses,
} from "@lms-repo-edge-version/db/utils/query/submissions";
import { env } from "@lms-repo-edge-version/env/server";
import { Hono } from "hono";
import { z } from "zod";

export const submissionsRoute = new Hono<{
	Variables: {
		user: Session["user"];
		session: Session["session"];
	};
}>()
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
				metadataList: z.array(
					z.object({
						objectName: z.string(),
						originalName: z.string(),
						mimeType: z.string(),
						fileSize: z.number(),
					}),
				),
				assignmentId: z.string(),
			}),
		),
		async (c) => {
			const { userId } = c.get("session");
			const { metadataList, assignmentId } = c.req.valid("json");

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
			await createDb()
				.insert(submissionStatus)
				.values({
					userId,
					assignmentId,
					status: "提出済み",
				})
				.onConflictDoUpdate({
					target: [submissionStatus.userId, submissionStatus.assignmentId],
					set: { status: "提出済み" },
				});

			return c.json({ successCount: results.length, results }, 201);
		},
	)
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
	});

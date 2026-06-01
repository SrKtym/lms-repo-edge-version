import { announcementType } from "@lms-repo-edge-version/db/schema/service";
import { MessagesSquare } from "@lms-repo-edge-version/ui/assets/icons/messages-square";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { DefaultModal } from "@lms-repo-edge-version/ui/components/modals/default-modal";
import { useForm } from "@tanstack/react-form";
import { useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useCreateAnnouncement } from "@/hooks/announcements";

export function CreateAnnouncementForm() {
	const { "course-id": courseId } = useSearch({
		from: "/_my-page/course-list",
	});
	const { mutate: createAnnouncement } = useCreateAnnouncement();
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			type: "資料",
			courseId: courseId || "",
		},
		onSubmit: async ({ value }) => {
			createAnnouncement(value);
		},
		validators: {
			onSubmit: z.object({
				title: z.string().min(1).max(100),
				description: z.string().min(1).max(500),
				type: z.enum(announcementType),
				courseId: z.string().min(1),
			}),
		},
	});

	return (
		<DefaultModal
			triggerButton={
				<DefaultButton>
					<MessagesSquare />
					お知らせを作成
				</DefaultButton>
			}
			heading="お知らせの作成"
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="form-field p-1"
			>
				<form.Field name="title">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									type: "text",
									minLength: 1,
									maxLength: 100,
									value: field.state.value,
									"aria-describedby": "title-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "タイトルを入力",
								}}
								labelProps={{
									htmlFor: field.name,
									children: "タイトル",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="title-error"
									key={error?.message}
									className="text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="description">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								textAreaProps={{
									id: field.name,
									name: field.name,
									minLength: 1,
									maxLength: 500,
									value: field.state.value,
									"aria-describedby": "description-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "説明を入力",
									rows: 3,
								}}
								labelProps={{
									htmlFor: field.name,
									children: "説明",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="description-error"
									key={error?.message}
									className="text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="type">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								selectProps={{
									value: field.state.value,
									onChange: (value) => {
										if (typeof value === "string") {
											field.handleChange(value);
										}
									},
									items: [...announcementType],
									ariaLabel: "select type",
								}}
								labelProps={{
									htmlFor: field.name,
									children: "提出形式",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="courseId">
					{(field) => (
						<input
							type="hidden"
							name={field.name}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
					)}
				</form.Field>

				<div className="flex justify-end gap-2">
					<CancelButton slot="close">キャンセル</CancelButton>
					<form.Subscribe>
						{({ canSubmit, isSubmitting }) => (
							<DefaultButton
								type="submit"
								slot="close"
								isDisabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "処理中..." : "作成"}
							</DefaultButton>
						)}
					</form.Subscribe>
				</div>
			</form>
		</DefaultModal>
	);
}

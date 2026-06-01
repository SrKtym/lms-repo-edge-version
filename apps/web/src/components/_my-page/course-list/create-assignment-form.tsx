import { assignmentFormat } from "@lms-repo-edge-version/db/schema/service";
import { FileText } from "@lms-repo-edge-version/ui/assets/icons/file-text";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { DefaultModal } from "@lms-repo-edge-version/ui/components/modals/default-modal";
import {
	getLocalTimeZone,
	now,
	type ZonedDateTime,
} from "@lms-repo-edge-version/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useCreateAssignment } from "@/hooks/assignments";

export function CreateAssignmentForm() {
	const dateTime = now(getLocalTimeZone());
	const { "course-id": courseId } = useSearch({
		from: "/_my-page/course-list",
	});
	const { mutate: createAssignment } = useCreateAssignment();
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			points: 0,
			dueDate: dateTime,
			format: "text",
			courseId: courseId || "",
		},
		onSubmit: async ({ value }) => {
			const { dueDate, ...rest } = value;
			createAssignment({
				...rest,
				dueDate: dueDate.toDate(),
			});
		},
		validators: {
			onSubmit: z.object({
				title: z.string().min(1).max(100),
				description: z.string().min(1).max(500),
				points: z.number().min(0).max(100),
				dueDate: z.custom<ZonedDateTime>(),
				format: z.enum(assignmentFormat),
				courseId: z.string().min(1),
			}),
		},
	});

	return (
		<DefaultModal
			triggerButton={
				<DefaultButton>
					<FileText />
					課題を作成
				</DefaultButton>
			}
			heading="課題の作成"
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
									children: "課題名",
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
									children: "課題の説明",
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

				<form.Field name="points">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								inputProps={{
									id: field.name,
									name: field.name,
									type: "number",
									min: 0,
									max: 100,
									step: 1,
									value: field.state.value,
									"aria-describedby": "points-error",
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(Number(e.target.value)),
								}}
								labelProps={{
									htmlFor: field.name,
									children: "点数",
								}}
							/>
							{field.state.meta.errors.map((error) => (
								<p
									id="points-error"
									key={error?.message}
									className="text-red-500"
								>
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="dueDate">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								datePickerProps={{
									defaultValue: field.state.value,
									onChange: (value) => {
										if (value) {
											field.handleChange(value);
										}
									},
								}}
								labelProps={{
									htmlFor: field.name,
									children: "締切日",
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

				<form.Field name="format">
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
									items: [...assignmentFormat],
									ariaLabel: "select format",
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

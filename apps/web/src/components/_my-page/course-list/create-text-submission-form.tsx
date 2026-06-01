import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCreateTextSubmission } from "@/hooks/submissions";

export function CreateTextSubmissionForm() {
	const { mutate: createTextSubmission } = useCreateTextSubmission();

	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
		onSubmit: async ({ value }) => {
			createTextSubmission(value);
		},
		validators: {
			onSubmit: z.object({
				title: z.string().min(1).max(100),
				description: z.string().min(1).max(2000),
			}),
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="form-field"
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
								placeholder: "タイトルを入力してください",
							}}
							labelProps={{
								htmlFor: field.name,
								children: "タイトル",
							}}
						/>
						{field.state.meta.errors.map((error) => (
							<p id="title-error" key={error?.message} className="text-red-500">
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
								maxLength: 2000,
								value: field.state.value,
								"aria-describedby": "description-error",
								onBlur: field.handleBlur,
								onChange: (e) => field.handleChange(e.target.value),
								placeholder: "最大2000文字まで入力できます",
								rows: 12,
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
			<div className="flex justify-end">
				<form.Subscribe>
					{({ canSubmit, isSubmitting }) => (
						<DefaultButton
							type="submit"
							isDisabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "処理中..." : "作成"}
						</DefaultButton>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}

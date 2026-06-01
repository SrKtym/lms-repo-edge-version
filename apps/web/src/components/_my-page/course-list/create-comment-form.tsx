import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useCreateComment } from "@/hooks/comments";

export function CreateCommentForm() {
	const { "assignment-id": assignmentId } = useSearch({
		from: "/_my-page/course-list",
	});
	const { mutate: createComment } = useCreateComment();
	const form = useForm({
		defaultValues: {
			content: "",
			assignmentId: assignmentId || "",
		},
		onSubmit: async ({ value }) => {
			createComment(value);
		},
		validators: {
			onSubmit: z.object({
				content: z.string().min(1, "内容を入力してください"),
				assignmentId: z.string().min(1, "課題IDを入力してください"),
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
			className="form-field p-1"
		>
			<form.Field name="content">
				{(field) => (
					<div className="space-y-2">
						<InputForForm
							textAreaProps={{
								id: field.name,
								name: field.name,
								value: field.state.value,
								maxLength: 200,
								placeholder: "最大200文字まで入力できます。",
								"aria-describedby": "comment-error",
								onBlur: field.handleBlur,
								onChange: (e) => field.handleChange(e.target.value),
								className: "shadow-lg dark:shadow-gray-800",
							}}
							labelProps={{
								htmlFor: field.name,
								children: "コメントを入力",
							}}
						/>
						{field.state.meta.errors.map((error) => (
							<p
								id="comment-error"
								key={error?.message}
								className="text-red-500"
							>
								{error?.message}
							</p>
						))}
					</div>
				)}
			</form.Field>

			<form.Field name="assignmentId">
				{(field) => (
					<input
						type="hidden"
						name={field.name}
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
					/>
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

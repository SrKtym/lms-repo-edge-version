import { coursesMaster } from "@lms-repo-edge-version/db/mock/course-master";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRegisterStudentData } from "@/hooks/students";

export function CreateStudentDataForm() {
	const facultyNames = Object.keys(coursesMaster).filter(
		(name): name is keyof typeof coursesMaster => name in coursesMaster,
	);

	const departments: string[] = [];

	facultyNames.forEach((facultyName) => {
		const departmentData = coursesMaster[facultyName];
		const filteredDepartments = Object.keys(departmentData).filter(
			(key) => key !== "全学科",
		);
		departments.push(...filteredDepartments);
	});

	const registerStudentData = useRegisterStudentData();

	const form = useForm({
		defaultValues: {
			grade: 1,
			departmentName: "",
		},
		onSubmit: async ({ value }) => {
			registerStudentData.mutate(value);
			location.reload();
		},
		validators: {
			onSubmit: z.object({
				grade: z.number().int().min(1).max(4),
				departmentName: z.string(),
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
			<form.Field name="grade">
				{(field) => (
					<div className="space-y-2">
						<InputForForm
							inputProps={{
								id: field.name,
								name: field.name,
								type: "number",
								min: 1,
								max: 4,
								step: 1,
								value: field.state.value,
								"aria-describedby": "grade-error",
								onBlur: field.handleBlur,
								onChange: (e) => field.handleChange(Number(e.target.value)),
							}}
							labelProps={{
								htmlFor: field.name,
								children: "学年",
							}}
						/>
						{field.state.meta.errors.map((error) => (
							<p id="grade-error" key={error?.message} className="text-red-500">
								{error?.message}
							</p>
						))}
					</div>
				)}
			</form.Field>
			<form.Field name="departmentName">
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
								items: departments,
								ariaLabel: "select department",
							}}
							labelProps={{
								htmlFor: field.name,
								children: "学科",
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
			<form.Subscribe>
				{({ canSubmit, isSubmitting }) => (
					<DefaultButton
						type="submit"
						fullWidth
						isDisabled={!canSubmit || isSubmitting}
					>
						{isSubmitting ? "処理中..." : "登録"}
					</DefaultButton>
				)}
			</form.Subscribe>
		</form>
	);
}

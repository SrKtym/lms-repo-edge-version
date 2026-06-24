import type { Schedules } from "@lms-repo-edge-version/db/types";
import type { FetchSchedulesReturnType } from "@lms-repo-edge-version/db/utils/query/schedules";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { ColorSwatchPicker } from "@lms-repo-edge-version/ui/components/color-swatch-picker";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { ControlledModal } from "@lms-repo-edge-version/ui/components/modals/controlled-modal";
import {
	fromDateToLocal,
	getLocalTimeZone,
	now,
	type ZonedDateTime,
} from "@lms-repo-edge-version/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCreateSchedule } from "@/hooks/schedules";

interface CreateScheduleFormProps {
	initialData?: FetchSchedulesReturnType[number];
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateScheduleForm({
	initialData,
	isOpen,
	onOpenChange,
}: CreateScheduleFormProps) {
	const dateTime = now(getLocalTimeZone());
	const start = initialData ? fromDateToLocal(initialData.startTime) : dateTime;
	const end = initialData ? fromDateToLocal(initialData.endTime) : dateTime;
	const { mutateAsync: createSchedule } = useCreateSchedule();
	const isEditMode = !!initialData;

	const form = useForm({
		defaultValues: {
			id: initialData?.id || "",
			title: initialData?.title || "",
			description: initialData?.description || "",
			timeSpan: {
				start: start,
				end: end,
			},
			theme: initialData?.theme || "#059669",
		},
		onSubmit: async ({ value }) => {
			const { timeSpan, ...rest } = value;

			const scheduleData: Omit<Schedules, "createdBy"> = {
				...rest,
				startTime: timeSpan.start.toDate(),
				endTime: timeSpan.end.toDate(),
			};

			const res = await createSchedule(scheduleData);

			if (res.status === 200) {
				onOpenChange(false);
			} else {
				return;
			}
		},
		validators: {
			onSubmit: z.object({
				id: z.string(),
				title: z.string(),
				description: z.string(),
				timeSpan: z
					.object({
						start: z.custom<ZonedDateTime>(),
						end: z.custom<ZonedDateTime>(),
					})
					.refine((v) => dateTime < v.start, {
						error: "開始日時は現在時刻よりも後でなければなりません。",
					})
					.refine((v) => v.start < v.end, {
						error: "開始日時は終了日時よりも前でなければなりません。",
					}),
				theme: z.string(),
			}),
		},
	});

	return (
		<ControlledModal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			heading={isEditMode ? "スケジュールの編集" : "スケジュールの追加"}
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
									value: field.state.value,
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "タイトルを入力",
								}}
								labelProps={{
									htmlFor: field.name,
									children: "タイトル",
								}}
								isRequired={false}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500">
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
									value: field.state.value,
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "説明を入力",
									rows: 3,
								}}
								labelProps={{
									children: "説明",
								}}
								isRequired={false}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="timeSpan">
					{(field) => (
						<div className="space-y-2">
							<InputForForm
								dateRangePickerProps={{
									defaultValue: {
										start: field.state.value.start,
										end: field.state.value.end,
									},
									onChange: (value) => {
										if (value) {
											field.handleChange({
												start: value.start,
												end: value.end,
											});
										}
									},
								}}
								labelProps={{
									children: "期間",
								}}
								isRequired={true}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="theme">
					{(field) => (
						<div className="space-y-2">
							<ColorSwatchPicker
								value={field.state.value}
								onChange={(color) => field.handleChange(color.toString("hex"))}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={error?.message} className="text-red-500">
									{error?.message}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="id">
					{(field) => (
						<input
							type="hidden"
							name="id"
							value={field.state.value}
							onChange={(e) => {
								console.log(e.target.value);
								field.handleChange(e.target.value);
							}}
						/>
					)}
				</form.Field>

				<div className="flex justify-end gap-2">
					<CancelButton onPress={() => onOpenChange(false)}>
						キャンセル
					</CancelButton>
					<form.Subscribe>
						{({ canSubmit, isSubmitting }) => (
							<DefaultButton
								type="submit"
								isDisabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "処理中..." : isEditMode ? "更新" : "作成"}
							</DefaultButton>
						)}
					</form.Subscribe>
				</div>
			</form>
		</ControlledModal>
	);
}

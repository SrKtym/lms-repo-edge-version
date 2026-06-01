import type {
	Schedules,
	SchedulesOptional,
} from "@lms-repo-edge-version/db/types";
import { CalendarClock } from "@lms-repo-edge-version/ui/assets/icons/calendar-clock";
import {
	CancelButton,
	DefaultButton,
} from "@lms-repo-edge-version/ui/components/button";
import { ColorSwatchPicker } from "@lms-repo-edge-version/ui/components/color-swatch-picker";
import { InputForForm } from "@lms-repo-edge-version/ui/components/input";
import { DefaultModal } from "@lms-repo-edge-version/ui/components/modals/default-modal";
import {
	getLocalTimeZone,
	now,
	type ZonedDateTime,
} from "@lms-repo-edge-version/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCreateSchedule } from "@/hooks/schedules";

export function CreateScheduleForm() {
	const dateTime = now(getLocalTimeZone());
	const createSchedule = useCreateSchedule();
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			timeSpan: { start: dateTime, end: dateTime },
			theme: "#059669",
		},
		onSubmit: async ({ value }) => {
			const { timeSpan, ...rest } = value;

			const scheduleData: Omit<Schedules, SchedulesOptional> = {
				...rest,
				startTime: timeSpan.start.toDate(),
				endTime: timeSpan.end.toDate(),
			};

			createSchedule.mutate(scheduleData);
		},
		validators: {
			onSubmit: z.object({
				title: z.string(),
				description: z.string(),
				timeSpan: z.object({
					start: z.custom<ZonedDateTime>(),
					end: z.custom<ZonedDateTime>(),
				}),
				theme: z.string(),
			}),
		},
	});

	return (
		<DefaultModal
			triggerButton={
				<DefaultButton>
					<CalendarClock />
					スケジュールを追加
				</DefaultButton>
			}
			heading="スケジュールの追加"
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

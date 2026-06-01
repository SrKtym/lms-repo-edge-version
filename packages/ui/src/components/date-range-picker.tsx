import {
	DateField,
	FieldError,
	Label,
	DateRangePicker as Picker,
	RangeCalendar,
	TimeField,
	type TimeValue,
} from "@heroui/react";
import {
	DateFormatter,
	type DateValue,
	getLocalTimeZone,
	type ZonedDateTime,
} from "@lms-repo-edge-version/ui/lib/utils";

interface DateRangePickerProps {
	defaultValue: { start: ZonedDateTime; end: ZonedDateTime };
	onChange: (
		value: { start: ZonedDateTime; end: ZonedDateTime } | null,
	) => void;
}

export function DateRangePicker({
	defaultValue,
	onChange,
}: DateRangePickerProps) {
	const localTimeZone = getLocalTimeZone();
	const dateFormatter = new DateFormatter("ja-JP", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: localTimeZone,
	});

	const formatDate = (date: { start: DateValue; end: DateValue }) => {
		const startDate = date.start.toDate(localTimeZone);
		const endDate = date.end.toDate(localTimeZone);
		return `${dateFormatter.format(startDate)} - ${dateFormatter.format(endDate)}`;
	};

	return (
		<Picker
			aria-label="Select dates"
			className="w-full"
			defaultValue={defaultValue}
			endName="endDate"
			isRequired
			granularity="minute"
			hideTimeZone={true}
			hourCycle={24}
			shouldForceLeadingZeros={true}
			startName="startDate"
			onChange={onChange}
		>
			{({ state }) => (
				<>
					<DateField.Group>
						<DateField.InputContainer>
							<DateField.Input slot="start">
								{(segment) => <DateField.Segment segment={segment} />}
							</DateField.Input>
							<Picker.RangeSeparator />
							<DateField.Input slot="end">
								{(segment) => <DateField.Segment segment={segment} />}
							</DateField.Input>
						</DateField.InputContainer>
						<DateField.Suffix>
							<Picker.Trigger>
								<Picker.TriggerIndicator />
							</Picker.Trigger>
						</DateField.Suffix>
					</DateField.Group>
					<FieldError />
					<Picker.Popover className="flex w-full flex-col gap-3 dark:border-gray-700 dark:bg-gray-800">
						<RangeCalendar
							aria-label="range-calendar"
							className="w-full dark:bg-gray-800 dark:text-white"
						>
							<RangeCalendar.Header>
								<RangeCalendar.YearPickerTrigger>
									<RangeCalendar.YearPickerTriggerHeading />
									<RangeCalendar.YearPickerTriggerIndicator />
								</RangeCalendar.YearPickerTrigger>
								<RangeCalendar.NavButton slot="previous" />
								<RangeCalendar.NavButton slot="next" />
							</RangeCalendar.Header>
							<RangeCalendar.Grid>
								<RangeCalendar.GridHeader>
									{(day) => (
										<RangeCalendar.HeaderCell className="dark:text-gray-300">
											{day}
										</RangeCalendar.HeaderCell>
									)}
								</RangeCalendar.GridHeader>
								<RangeCalendar.GridBody>
									{(date) => <RangeCalendar.Cell date={date} />}
								</RangeCalendar.GridBody>
							</RangeCalendar.Grid>
							<RangeCalendar.YearPickerGrid>
								<RangeCalendar.YearPickerGridBody>
									{({ year }) => (
										<RangeCalendar.YearPickerCell
											year={year}
											className="dark:text-white dark:hover:bg-gray-700"
										/>
									)}
								</RangeCalendar.YearPickerGridBody>
							</RangeCalendar.YearPickerGrid>
						</RangeCalendar>
						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<Label>開始日時</Label>
								<TimeField
									aria-label="Start Time"
									granularity="minute"
									hideTimeZone={true}
									hourCycle={24}
									name="startTime"
									shouldForceLeadingZeros={true}
									value={state.timeRange?.start ?? null}
									onChange={(v) =>
										state.setTimeRange({
											end: state.timeRange?.end as TimeValue,
											start: v as TimeValue,
										})
									}
								>
									<TimeField.Group
										variant="secondary"
										className="dark:border-gray-600 dark:bg-gray-700"
									>
										<TimeField.Input>
											{(segment) => <TimeField.Segment segment={segment} />}
										</TimeField.Input>
									</TimeField.Group>
								</TimeField>
							</div>
							<div className="flex items-center justify-between">
								<Label>終了時刻</Label>
								<TimeField
									aria-label="End Time"
									granularity="minute"
									hideTimeZone={true}
									hourCycle={24}
									name="endTime"
									shouldForceLeadingZeros={true}
									value={state.timeRange?.end ?? null}
									onChange={(v) =>
										state.setTimeRange({
											end: v as TimeValue,
											start: state.timeRange?.start as TimeValue,
										})
									}
								>
									<TimeField.Group
										variant="secondary"
										className="dark:border-gray-600 dark:bg-gray-700"
									>
										<TimeField.Input>
											{(segment) => <TimeField.Segment segment={segment} />}
										</TimeField.Input>
									</TimeField.Group>
								</TimeField>
							</div>
						</div>
						<span className="mt-1 text-muted text-xs dark:text-gray-400">
							期間:{" "}
							{state.value.start && state.value.end
								? formatDate({ end: state.value.end, start: state.value.start })
								: "日時が選択されていません"}
						</span>
					</Picker.Popover>
				</>
			)}
		</Picker>
	);
}

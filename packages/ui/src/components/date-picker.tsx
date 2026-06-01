import {
	Calendar,
	DateField,
	Label,
	DatePicker as Picker,
	TimeField,
	type TimeValue,
} from "@heroui/react";
import type { ZonedDateTime } from "@lms-repo-edge-version/ui/lib/utils";

interface DatePickerProps {
	defaultValue: ZonedDateTime;
	onChange: (value: ZonedDateTime | null) => void;
}

export function DatePicker({ defaultValue, onChange }: DatePickerProps) {
	return (
		<Picker
			aria-label="Select dates"
			className="w-full"
			defaultValue={defaultValue}
			isRequired
			granularity="minute"
			hideTimeZone={true}
			hourCycle={24}
			shouldForceLeadingZeros={true}
			onChange={onChange}
		>
			{({ state }) => (
				<>
					<DateField.Group>
						<DateField.Input>
							{(segment) => <DateField.Segment segment={segment} />}
						</DateField.Input>
						<DateField.Suffix>
							<Picker.Trigger>
								<Picker.TriggerIndicator />
							</Picker.Trigger>
						</DateField.Suffix>
					</DateField.Group>
					<Picker.Popover className="flex w-full flex-col gap-3 dark:border-gray-700 dark:bg-gray-800">
						<Calendar
							aria-label="Event date"
							className="w-full dark:bg-gray-800 dark:text-white"
						>
							<Calendar.Header>
								<Calendar.YearPickerTrigger>
									<Calendar.YearPickerTriggerHeading />
									<Calendar.YearPickerTriggerIndicator />
								</Calendar.YearPickerTrigger>
								<Calendar.NavButton slot="previous" />
								<Calendar.NavButton slot="next" />
							</Calendar.Header>
							<Calendar.Grid>
								<Calendar.GridHeader>
									{(day) => (
										<Calendar.HeaderCell className="dark:text-gray-300">
											{day}
										</Calendar.HeaderCell>
									)}
								</Calendar.GridHeader>
								<Calendar.GridBody>
									{(date) => <Calendar.Cell date={date} />}
								</Calendar.GridBody>
							</Calendar.Grid>
							<Calendar.YearPickerGrid>
								<Calendar.YearPickerGridBody>
									{({ year }) => (
										<Calendar.YearPickerCell
											className="dark:text-white dark:hover:bg-gray-700"
											year={year}
										/>
									)}
								</Calendar.YearPickerGridBody>
							</Calendar.YearPickerGrid>
						</Calendar>
						<div className="flex items-center justify-between">
							<Label>時刻</Label>
							<TimeField
								aria-label="Time"
								granularity="minute"
								hideTimeZone={true}
								hourCycle={24}
								name="time"
								shouldForceLeadingZeros={true}
								value={state.timeValue}
								onChange={(v) => state.setTimeValue(v as TimeValue)}
							>
								<TimeField.Group variant="secondary">
									<TimeField.Input>
										{(segment) => <TimeField.Segment segment={segment} />}
									</TimeField.Input>
								</TimeField.Group>
							</TimeField>
						</div>
					</Picker.Popover>
				</>
			)}
		</Picker>
	);
}

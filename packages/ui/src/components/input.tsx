import { FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
import { DatePicker } from "./date-picker";
import { DateRangePicker } from "./date-range-picker";
import { DefaultSelect } from "./select";

interface InputForFormProps {
	inputProps?: React.ComponentProps<typeof Input>;
	labelProps: React.ComponentProps<typeof Label>;
	textAreaProps?: React.ComponentProps<typeof TextArea>;
	datePickerProps?: React.ComponentProps<typeof DatePicker>;
	dateRangePickerProps?: React.ComponentProps<typeof DateRangePicker>;
	selectProps?: React.ComponentProps<typeof DefaultSelect>;
	isRequired?: boolean;
}

// // フォーム用の入力コンポーネント
export function InputForForm({
	inputProps,
	labelProps,
	textAreaProps,
	datePickerProps,
	dateRangePickerProps,
	selectProps,
	isRequired,
}: InputForFormProps) {
	return (
		<TextField fullWidth isRequired={isRequired ?? true}>
			<Label {...labelProps}>{labelProps.children}</Label>
			{inputProps && <Input {...inputProps} />}
			{textAreaProps && <TextArea {...textAreaProps} />}
			{datePickerProps && <DatePicker {...datePickerProps} />}
			{dateRangePickerProps && <DateRangePicker {...dateRangePickerProps} />}
			{selectProps && <DefaultSelect {...selectProps} />}
			{!datePickerProps && !dateRangePickerProps && <FieldError />}
		</TextField>
	);
}

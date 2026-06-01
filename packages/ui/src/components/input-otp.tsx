import { InputOTP } from "@heroui/react";

interface InputOTPFor2faProps {
	name: string;
	value: string;
	onChange: (value: string) => void;
	ariaDescribedby?: string;
}

export function InputOTPFor2fa({
	name,
	value,
	onChange,
	ariaDescribedby,
}: InputOTPFor2faProps) {
	return (
		<InputOTP
			name={name}
			value={value}
			maxLength={6}
			onChange={onChange}
			required
			aria-describedby={ariaDescribedby}
		>
			<InputOTP.Group>
				<InputOTP.Slot index={0} />
				<InputOTP.Slot index={1} />
				<InputOTP.Slot index={2} />
			</InputOTP.Group>
			<InputOTP.Separator />
			<InputOTP.Group>
				<InputOTP.Slot index={3} />
				<InputOTP.Slot index={4} />
				<InputOTP.Slot index={5} />
			</InputOTP.Group>
		</InputOTP>
	);
}

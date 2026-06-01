import { Checkbox } from "@heroui/react";

export function CheckboxForDataTable(
	props: React.ComponentProps<typeof Checkbox>,
) {
	return (
		<Checkbox slot="selection" variant="primary" {...props}>
			<Checkbox.Control>
				<Checkbox.Indicator />
			</Checkbox.Control>
		</Checkbox>
	);
}

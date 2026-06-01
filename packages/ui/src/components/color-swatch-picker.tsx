import { type Color, Label, ColorSwatchPicker as Picker } from "@heroui/react";

interface ColorSwatchPickerProps {
	value: string;
	onChange: (value: Color) => void;
}

// 汎用カラースオッチピッカー
export function ColorSwatchPicker({ value, onChange }: ColorSwatchPickerProps) {
	return (
		<div className="space-y-2">
			<Label>テーマ</Label>
			<Picker value={value} onChange={onChange}>
				<Picker.Item color="#F43F5E">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
				<Picker.Item color="#EF4444">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
				<Picker.Item color="#F59E0B">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
				<Picker.Item color="#D946EF">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
				<Picker.Item color="#8B5CF6">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
				<Picker.Item color="#3B82F6">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
				<Picker.Item color="#10B981">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
				<Picker.Item color="#059669">
					<Picker.Swatch />
					<Picker.Indicator />
				</Picker.Item>
			</Picker>
		</div>
	);
}

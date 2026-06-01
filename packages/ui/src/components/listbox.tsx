import { ListBox } from "@heroui/react";

export function SingleSelectListBox({ items }: { items: string[] }) {
	return (
		<ListBox selectionMode="single">
			{items.map((item, index) => (
				<ListBox.Item key={index} id={item} textValue={item} aria-label={item}>
					{item}
					<ListBox.ItemIndicator />
				</ListBox.Item>
			))}
		</ListBox>
	);
}

export function MultiSelectListBox({ items }: { items: string[] }) {
	return (
		<ListBox selectionMode="multiple">
			{items.map((item, index) => (
				<ListBox.Item key={index} id={item} textValue={item} aria-label={item}>
					{item}
					<ListBox.ItemIndicator />
				</ListBox.Item>
			))}
		</ListBox>
	);
}

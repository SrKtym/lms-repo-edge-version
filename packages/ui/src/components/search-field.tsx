import { SearchField } from "@heroui/react";

// 汎用検索フィールド
export function DefaultSearchField({
	placeholder,
	value,
	onChange,
}: {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<SearchField
			name="search"
			aria-label="Search"
			value={value}
			onChange={onChange}
		>
			<SearchField.Group>
				<SearchField.SearchIcon />
				<SearchField.Input placeholder={placeholder} />
				<SearchField.ClearButton />
			</SearchField.Group>
		</SearchField>
	);
}

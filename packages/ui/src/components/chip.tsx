import { Chip } from "@heroui/react";

// 汎用チップコンポーネント
export function DefaultChip(props: React.ComponentProps<typeof Chip>) {
	return <Chip variant="soft" {...props} />;
}

import { Avatar } from "@heroui/react";

interface DefaultAvatarProps {
	size?: "md" | "lg" | "sm";
	src?: string | null;
	userName?: string;
}

// 汎用アバターコンポーネント
export function DefaultAvatar({
	size = "md",
	src,
	userName,
}: DefaultAvatarProps) {
	return (
		<Avatar size={size}>
			<Avatar.Image src={src || undefined} alt={userName} />
			<Avatar.Fallback>{userName?.at(0)}</Avatar.Fallback>
		</Avatar>
	);
}

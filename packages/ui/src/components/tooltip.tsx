import { Tooltip } from "@heroui/react";

interface DefaultTooltipProps {
	triggerElement: React.ReactNode;
	content?: React.ReactNode;
}

// 汎用ツールチップ
export function DefaultTooltip({
	triggerElement,
	content,
}: DefaultTooltipProps) {
	return (
		<Tooltip delay={0}>
			<Tooltip.Trigger className="w-full">{triggerElement}</Tooltip.Trigger>
			<Tooltip.Content placement="right">{content}</Tooltip.Content>
		</Tooltip>
	);
}

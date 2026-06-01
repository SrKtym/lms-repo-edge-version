import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Tailwind,
	Text,
} from "@react-email/components";

interface BaseEmailTemplateProps {
	preview: string;
	title: string;
	children: React.ReactNode;
	email: string;
}

export function BaseEmailTemplate({
	preview,
	title,
	children,
	email,
}: BaseEmailTemplateProps) {
	return (
		<Html lang="ja">
			<Head />
			<Preview>{preview}</Preview>
			<Tailwind>
				<Body className="bg-gray-50">
					<Container className="mx-auto w-full max-w-[480px] space-y-6 rounded-3xl border border-gray-200 border-solid bg-white p-6 shadow-lg">
						<Heading className="text-center font-bold text-2xl text-gray-900">
							{title}
						</Heading>
						<div className="space-y-4">{children}</div>
						<Hr className="w-auto border border-gray-200 border-solid" />
						<Text className="text-center text-gray-500 text-sm">
							このメールは{" "}
							<span className="font-medium text-blue-600">{email}</span>{" "}
							宛に送信されました。
							<br />
							もし意図しないメールである場合は、このメールを無視してください。
						</Text>
						<Text className="text-center text-gray-400 text-xs">
							© {new Date().getFullYear()} LMS. All rights reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

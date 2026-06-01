import { CalendarClock } from "@lms-repo-edge-version/ui/assets/icons/calendar-clock";
import { MessagesSquare } from "@lms-repo-edge-version/ui/assets/icons/messages-square";
import { NotebookPen } from "@lms-repo-edge-version/ui/assets/icons/notebook-pen";
import { SquarePlus } from "@lms-repo-edge-version/ui/assets/icons/square-plus";
import { motion } from "motion/react";
import { BaseCard } from "../cards/base-card";

interface Feature {
	title: string;
	description: string;
	icon: React.ReactNode;
}

interface FeaturesSectionCardProps {
	features?: Feature[];
	title?: string;
	className?: string;
}

export function FeaturesSectionCard({
	features,
	title = "アプリの主な機能",
	className = "",
}: FeaturesSectionCardProps) {
	const defaultFeatures: Feature[] = [
		{
			title: "履修登録",
			description: "講義の検索、履修登録、時間割作成などを行うことができます",
			icon: <SquarePlus width={24} height={24} />,
		},
		{
			title: "スケジュール管理",
			description:
				"スケジュールを作成・管理し、カレンダー上で一目で確認できます",
			icon: <CalendarClock width={24} height={24} />,
		},
		{
			title: "通知管理",
			description:
				"授業のキャンセルやテスト情報に関する通知を受け取ることができます",
			icon: <MessagesSquare width={24} height={24} />,
		},
		{
			title: "課題管理",
			description: "課題一覧を表示し、作成・提出を行うことができます",
			icon: <NotebookPen width={24} height={24} />,
		},
	];

	const featuresList = features || defaultFeatures;

	const properties = {
		initial: { opacity: 0, y: 20 },
		transition: { duration: 0.5 },
		whileInView: { opacity: 1, y: 0 },
		viewport: {
			amount: 0.5,
			once: true,
		},
	};

	return (
		<section className={`px-4 py-20 ${className}`} id="features">
			<div className="container mx-auto max-w-6xl">
				<motion.div className="mb-16 text-center" {...properties}>
					<h2 className="mb-4 font-bold text-3xl">{title}</h2>
				</motion.div>
				<motion.div
					className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
					{...properties}
				>
					{featuresList.map((feature) => (
						<BaseCard key={feature.title}>
							<div className="p-6">
								<div className="mb-4 flex items-center justify-center">
									{feature.icon}
								</div>
								<h3 className="mb-2 text-center font-semibold text-lg">
									{feature.title}
								</h3>
								<p className="text-center text-gray-600 dark:text-gray-400">
									{feature.description}
								</p>
							</div>
						</BaseCard>
					))}
				</motion.div>
			</div>
		</section>
	);
}

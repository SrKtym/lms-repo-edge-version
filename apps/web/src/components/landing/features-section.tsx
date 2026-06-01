import { CalendarClock } from "@lms-repo-edge-version/ui/assets/icons/calendar-clock";
import { MessagesSquare } from "@lms-repo-edge-version/ui/assets/icons/messages-square";
import { NotebookPen } from "@lms-repo-edge-version/ui/assets/icons/notebook-pen";
import { SquarePlus } from "@lms-repo-edge-version/ui/assets/icons/square-plus";
import { BaseCard } from "@lms-repo-edge-version/ui/components/cards/base-card";
import { motion } from "motion/react";

export function FeaturesSection() {
	const features = [
		{
			title: "履修登録",
			description: "講義を登録し、時間割を作成することができます",
			icon: <SquarePlus width={24} height={24} />,
		},
		{
			title: "スケジュール管理",
			description: "スケジュールの作成・変更・削除ができます",
			icon: <CalendarClock width={24} height={24} />,
		},
		{
			title: "通知管理",
			description:
				"休講やテストの情報などについての通知があった時に、受け取ることができます",
			icon: <MessagesSquare width={24} height={24} />,
		},
		{
			title: "課題管理",
			description:
				"課題の一覧を確認したり、作成・提出をしたりすることができます",
			icon: <NotebookPen width={24} height={24} />,
		},
	];

	const propaties = {
		initial: { opacity: 0, y: 20 },
		transition: { duration: 0.5 },
		whileInView: { opacity: 1, y: 0 },
		viewport: {
			amount: 0.5,
			once: true,
		},
	};

	return (
		<section className="px-4 py-20" id="features">
			<div className="container mx-auto max-w-6xl">
				<motion.div className="mb-16 text-center" {...propaties}>
					<h2 className="mb-4 font-bold text-3xl">このアプリの特徴</h2>
				</motion.div>
				<motion.div
					className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
					{...propaties}
				>
					{features.map((feature) => (
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

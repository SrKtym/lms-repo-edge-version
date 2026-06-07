import { motion } from "motion/react";
import { TypewriterText } from "./typewriter-text";

interface HeroSectionProps {
	children: React.ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
	const features = [
		"時間割管理",
		"課題管理",
		"通知機能",
		"マルチデバイス",
	] as const;

	return (
		<section className="relative flex min-h-screen items-center justify-center overflow-hidden">
			{/* Background Gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

			{/* Decorative Elements */}
			<div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400 opacity-20 blur-3xl" />
			<div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-purple-400 opacity-20 blur-3xl" />

			{/* Main Content */}
			<div className="container relative z-10 mx-auto px-4 py-20">
				<div className="mx-auto max-w-4xl text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="mb-8"
					>
						<div className="mb-8 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800 text-sm dark:bg-blue-900 dark:text-blue-200">
							🎓 新しい学習体験へ
						</div>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="mb-6 font-bold text-4xl text-gray-900 tracking-tight sm:text-5xl md:text-6xl dark:text-white"
					>
						<TypewriterText
							texts={[
								"manages enrolled courses",
								"manages your schedules",
								"manages your assignments",
							]}
							className="block"
						/>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mx-auto mb-10 max-w-3xl text-gray-600 text-lg sm:text-xl dark:text-gray-300"
					>
						このアプリは大学生の学習をサポートすることを目的として開発されました。
						時間割の作成やスケジュールの管理、課題の管理をこれ一つで実現できます。
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="flex items-center justify-center"
					>
						{children}
					</motion.div>

					{/* Feature Pills */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="mt-16 flex flex-wrap justify-center gap-4"
					>
						{features.map((feature) => (
							<div
								key={feature}
								className="rounded-full bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-md dark:bg-gray-800 dark:text-gray-300"
							>
								{feature}
							</div>
						))}
					</motion.div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.8 }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
			>
				<div className="animate-bounce">
					<svg
						className="h-6 w-6 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</div>
			</motion.div>
		</section>
	);
}

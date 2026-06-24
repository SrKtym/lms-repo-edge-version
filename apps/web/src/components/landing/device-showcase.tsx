import { motion, useAnimation, useScroll } from "motion/react";
import { useEffect, useRef } from "react";

export function DeviceShowcase() {
	const controls = useAnimation();
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	useEffect(() => {
		const unsubscribe = scrollYProgress.on("change", (latest) => {
			if (latest > 0.1) {
				controls.start("visible");
			}
		});
		return unsubscribe;
	}, [controls, scrollYProgress]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
		},
	};

	return (
		<section ref={ref} className="bg-gray-50 px-4 py-20 dark:bg-gray-900">
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="mb-16 text-center"
				>
					<h2 className="mb-4 font-bold text-3xl text-gray-900 dark:text-white">
						あらゆるデバイスで利用可能
					</h2>
					<p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
						スマートフォン、タブレット、デスクトップなど、お使いのデバイスで最適な体験を提供します
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={controls}
					transition={{
						duration: 0.8,
						staggerChildren: 0.2,
					}}
					className="grid grid-cols-1 gap-8 md:grid-cols-3"
				>
					{/* Smartphone */}
					<motion.div
						variants={itemVariants}
						transition={{ duration: 0.6 }}
						className="text-center"
					>
						<div className="mx-auto mb-6 h-80 w-auto max-w-40">
							<div className="relative h-full w-full rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-2 shadow-2xl">
								{/* Screen */}
								<div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100">
									{/* Status bar */}
									<div className="absolute top-0 right-0 left-0 h-6 bg-black/10 backdrop-blur-sm">
										<div className="flex h-full items-center justify-between px-3">
											<span className="font-medium text-xs">9:41</span>
											<div className="h-1 w-1 rounded-full bg-gray-600" />
										</div>
									</div>
									{/* App content */}
									<div className="px-3 pt-8">
										<div className="mb-2 rounded-lg bg-white p-2 shadow-sm">
											<div className="mb-1 h-2 w-3/4 rounded bg-blue-500" />
											<div className="mb-1 h-2 w-1/2 rounded bg-gray-200" />
											<div className="h-2 w-2/3 rounded bg-gray-200" />
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div className="rounded-lg bg-white p-2 shadow-sm">
												<div className="mb-1 h-8 rounded bg-green-100" />
												<div className="h-1 w-2/3 rounded bg-gray-200" />
											</div>
											<div className="rounded-lg bg-white p-2 shadow-sm">
												<div className="mb-1 h-8 rounded bg-purple-100" />
												<div className="h-1 w-2/3 rounded bg-gray-200" />
											</div>
										</div>
									</div>
									{/* Home indicator */}
									<div className="absolute bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-gray-400" />
								</div>
							</div>
						</div>
						<h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
							スマートフォン
						</h3>
						<p className="text-gray-600 text-sm dark:text-gray-400">
							移動中でも手軽に確認
						</p>
					</motion.div>

					{/* Tablet */}
					<motion.div
						variants={itemVariants}
						transition={{ duration: 0.6 }}
						className="text-center"
					>
						<div className="mx-auto mb-6 h-80 w-auto max-w-60">
							<div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 p-3 shadow-2xl">
								{/* Screen */}
								<div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-100">
									{/* Status bar */}
									<div className="absolute top-0 right-0 left-0 h-6 bg-black/10 backdrop-blur-sm">
										<div className="flex h-full items-center justify-between px-4">
											<span className="font-medium text-xs">9:41</span>
											<div className="h-1 w-1 rounded-full bg-gray-600" />
										</div>
									</div>
									{/* App content */}
									<div className="px-4 pt-8">
										<div className="mb-3 rounded-lg bg-white p-3 shadow-sm">
											<div className="mb-2 h-3 w-2/3 rounded bg-blue-500" />
											<div className="mb-1 h-2 w-full rounded bg-gray-200" />
											<div className="h-2 w-4/5 rounded bg-gray-200" />
										</div>
										<div className="grid grid-cols-3 gap-2">
											<div className="rounded-lg bg-white p-2 shadow-sm">
												<div className="mb-1 h-10 rounded bg-orange-100" />
												<div className="h-1 w-full rounded bg-gray-200" />
											</div>
											<div className="rounded-lg bg-white p-2 shadow-sm">
												<div className="mb-1 h-10 rounded bg-pink-100" />
												<div className="h-1 w-full rounded bg-gray-200" />
											</div>
											<div className="rounded-lg bg-white p-2 shadow-sm">
												<div className="mb-1 h-10 rounded bg-yellow-100" />
												<div className="h-1 w-full rounded bg-gray-200" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
							タブレット
						</h3>
						<p className="text-gray-600 text-sm dark:text-gray-400">
							勉強に最適なサイズ
						</p>
					</motion.div>

					{/* Desktop */}
					<motion.div
						variants={itemVariants}
						transition={{ duration: 0.6 }}
						className="text-center"
					>
						<div className="mx-auto mb-6 h-80 w-auto max-w-80">
							<div className="relative h-full">
								{/* Monitor */}
								<div className="relative h-64 w-full rounded-t-lg bg-gradient-to-br from-gray-900 to-gray-800 p-3 shadow-2xl">
									{/* Screen */}
									<div className="relative h-full w-full overflow-hidden rounded bg-gradient-to-br from-orange-50 to-red-50">
										{/* Browser chrome */}
										<div className="absolute top-0 right-0 left-0 h-8 border-gray-200 border-b bg-white/90 backdrop-blur-sm">
											<div className="flex h-full items-center justify-between px-3">
												<div className="flex items-center gap-2">
													<div className="h-3 w-3 rounded-full bg-red-500" />
													<div className="h-3 w-3 rounded-full bg-yellow-500" />
													<div className="h-3 w-3 rounded-full bg-green-500" />
												</div>
												<div className="mx-3 flex-1">
													<div className="h-4 rounded-full bg-gray-100" />
												</div>
											</div>
										</div>
										{/* Web content */}
										<div className="px-4 pt-10">
											<div className="mb-3 rounded-lg bg-white p-3 shadow-sm">
												<div className="mb-2 h-4 w-1/2 rounded bg-indigo-500" />
												<div className="space-y-1">
													<div className="h-2 w-full rounded bg-gray-200" />
													<div className="h-2 w-5/6 rounded bg-gray-200" />
													<div className="h-2 w-4/5 rounded bg-gray-200" />
												</div>
											</div>
											<div className="grid grid-cols-2 gap-3">
												<div className="rounded-lg bg-white p-2 shadow-sm">
													<div className="mb-2 h-12 rounded bg-teal-100" />
													<div className="h-1 w-3/4 rounded bg-gray-200" />
												</div>
												<div className="rounded-lg bg-white p-2 shadow-sm">
													<div className="mb-2 h-12 rounded bg-cyan-100" />
													<div className="h-1 w-3/4 rounded bg-gray-200" />
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* Stand */}
								<div className="mx-auto h-3 w-16 rounded-b-lg bg-gray-700" />
								<div className="mx-auto h-2 w-24 rounded bg-gray-600" />
							</div>
						</div>
						<h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
							デスクトップ
						</h3>
						<p className="text-gray-600 text-sm dark:text-gray-400">
							充実した機能で効率的に
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

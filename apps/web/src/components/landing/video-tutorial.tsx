import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { LazyMotionProvider } from "@lms-repo-edge-version/ui/components/lazymotion-provider";
import { DAYS } from "@lms-repo-edge-version/ui/lib/utils";
import * as m from "motion/react-m";
import { useState } from "react";

export function VideoTutorial() {
	const [currentStep, setCurrentStep] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCourse, setSelectedCourse] = useState("");

	const courses = [
		"データベース論",
		"アルゴリズムとデータ構造",
		"ソフトウェア工学",
		"機械学習入門",
		"Webアプリケーション開発",
	] as const;

	const filteredCourses = courses.filter((course) =>
		course.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleStepChange = (step: number) => {
		setCurrentStep(step);
		if (step === 0) {
			setSearchQuery("");
			setSelectedCourse("");
		}
	};

	return (
		<section className="px-4 py-20">
			<div className="container mx-auto max-w-6xl">
				<LazyMotionProvider>
					<m.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="mb-16 text-center"
					>
						<h2 className="mb-4 font-bold text-3xl text-gray-900 dark:text-white">
							講義登録チュートリアル
						</h2>
						<p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
							検索から登録までの流れを実際に体験してみましょう
						</p>
					</m.div>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						{/* Interactive Demo */}
						<m.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="relative overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
						>
							<div className="p-6">
								{/* Step Indicator */}
								<div className="mb-6 flex items-center justify-between">
									<div className="flex space-x-2">
										{[0, 1, 2, 3].map((step) => (
											<div
												key={step}
												className={`h-2 flex-1 rounded-full transition-colors ${
													currentStep >= step
														? "bg-blue-500"
														: "bg-gray-200 dark:bg-gray-700"
												}`}
											/>
										))}
									</div>
								</div>

								{/* Demo Content */}
								{currentStep === 0 && (
									<m.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="space-y-4"
									>
										<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
											ステップ1: 講義を検索
										</h3>
										<div className="relative">
											<input
												type="text"
												placeholder="講義名を入力してください..."
												value={searchQuery}
												onChange={(e) => {
													const target = e.currentTarget;
													setSearchQuery(target.value);
												}}
												className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
											/>
											<svg
												className="absolute top-2.5 right-3 h-5 w-5 text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
												/>
											</svg>
										</div>
										{searchQuery && (
											<div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
												{filteredCourses.length > 0 ? (
													filteredCourses.map((course) => (
														<div
															key={course}
															onClick={() => {
																setSelectedCourse(course);
																setCurrentStep(1);
															}}
															className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
														>
															{course}
														</div>
													))
												) : (
													<div className="px-4 py-2 text-gray-500 dark:text-gray-400">
														該当する講義が見つかりません
													</div>
												)}
											</div>
										)}
									</m.div>
								)}

								{currentStep === 1 && (
									<m.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="space-y-4"
									>
										<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
											ステップ2: 講義詳細を確認
										</h3>
										<div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
											<h4 className="font-medium text-gray-900 dark:text-white">
												{selectedCourse}
											</h4>
											<p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
												担当教授: 田中教授
												<br />
												単位数: 2単位
												<br />
												時間割: 月曜 3限
												<br />
												教室: A101
											</p>
										</div>
									</m.div>
								)}

								{currentStep === 2 && (
									<m.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="space-y-4"
									>
										<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
											ステップ3: 時間割に追加
										</h3>
										<div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
											<div className="mb-4 text-gray-600 text-sm dark:text-gray-400">
												以下の時間割に追加されます:
											</div>
											<div className="grid grid-cols-7 gap-1 text-xs">
												{DAYS.map((day) => (
													<div
														key={day}
														className="text-center font-medium text-gray-700 dark:text-gray-300"
													>
														{day}
													</div>
												))}
												{Array.from({ length: 35 }).map((_, i) => (
													<div
														key={i}
														className={`aspect-square rounded border ${
															i === 17
																? "bg-blue-500 text-white"
																: "border-gray-200 dark:border-gray-700"
														}`}
													>
														{i === 17 && (
															<div className="flex h-full items-center justify-center text-xs">
																3限
															</div>
														)}
													</div>
												))}
											</div>
										</div>
									</m.div>
								)}

								{currentStep === 3 && (
									<m.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="space-y-4 text-center"
									>
										<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
											<svg
												className="h-8 w-8 text-green-600 dark:text-green-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<h3 className="font-semibold text-gray-900 text-lg dark:text-white">
											登録完了！
										</h3>
										<p className="text-gray-600 dark:text-gray-400">
											{selectedCourse}が時間割に追加されました
										</p>
									</m.div>
								)}

								{/* Navigation Buttons */}
								<div className="mt-6 flex justify-between">
									<DefaultButton
										variant="outline"
										onClick={() =>
											handleStepChange(Math.max(0, currentStep - 1))
										}
										isDisabled={currentStep === 0}
									>
										戻る
									</DefaultButton>
									<DefaultButton
										onClick={() => {
											if (currentStep === 1) setCurrentStep(2);
											else if (currentStep === 2) {
												setCurrentStep(3);
											} else if (currentStep === 0 && selectedCourse) {
												setCurrentStep(1);
											}
										}}
										isDisabled={currentStep === 0 && !selectedCourse}
									>
										{currentStep === 3
											? "完了"
											: currentStep === 2
												? "登録する"
												: "次へ"}
									</DefaultButton>
								</div>
							</div>
						</m.div>

						{/* Tutorial Steps */}
						<m.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="space-y-6"
						>
							<h3 className="font-bold text-2xl text-gray-900 dark:text-white">
								講義登録の手順
							</h3>
							<div className="space-y-4">
								{[
									{
										step: "1",
										title: "講義を検索",
										description: "検索フィールドに登録したい講義名を入力します",
										active: currentStep === 0,
									},
									{
										step: "2",
										title: "詳細を確認",
										description:
											"講義情報（担当教授、単位数、時間割など）を確認します",
										active: currentStep === 1,
									},
									{
										step: "3",
										title: "時間割に追加",
										description:
											"時間割プレビューで追加位置を確認し、登録ボタンを押します",
										active: currentStep === 2,
									},
									{
										step: "4",
										title: "登録完了",
										description: "講義が時間割に追加され、登録が完了します",
										active: currentStep === 3,
									},
								].map((item, index) => (
									<m.div
										key={item.step}
										initial={{ opacity: 0, x: 20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
										className={`flex items-start space-x-4 rounded-lg p-4 transition-colors ${
											item.active ? "bg-blue-50 dark:bg-blue-900/20" : ""
										}`}
									>
										<div
											className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold ${
												item.active
													? "bg-blue-500 text-white"
													: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
											}`}
										>
											{item.step}
										</div>
										<div>
											<h4 className="font-semibold text-gray-900 dark:text-white">
												{item.title}
											</h4>
											<p className="text-gray-600 text-sm dark:text-gray-400">
												{item.description}
											</p>
										</div>
									</m.div>
								))}
							</div>
						</m.div>
					</div>
				</LazyMotionProvider>
			</div>
		</section>
	);
}

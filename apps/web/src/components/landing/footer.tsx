import { Link } from "@tanstack/react-router";

export function Footer() {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
					{/* Company Info - 2 columns on large screens */}
					<div className="col-span-1 md:col-span-2 lg:col-span-2">
						<div className="mb-6">
							<h3 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-2xl text-transparent">
								LMS
							</h3>
							<p className="mb-4 text-gray-400 leading-relaxed">
								大学生のための教育管理アプリケーション。
								時間割を作成し、スケジュールを管理し、課題を処理します。
							</p>
						</div>

						{/* Social Links */}
						<div className="mb-6">
							<h5 className="mb-3 font-medium text-gray-300">Follow Us</h5>
							<div className="flex space-x-3">
								<a
									href="#"
									className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-blue-600 hover:text-white"
									aria-label="Twitter"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
									</svg>
								</a>
								<a
									href="#"
									className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-blue-700 hover:text-white"
									aria-label="Facebook"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
									</svg>
								</a>
								<a
									href="#"
									className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-pink-600 hover:text-white"
									aria-label="Instagram"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
										<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
										<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
									</svg>
								</a>
								<a
									href="#"
									className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
									aria-label="GitHub"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
									</svg>
								</a>
							</div>
						</div>

						{/* Legal Links */}
						<div className="flex flex-wrap gap-4 text-sm">
							<a
								href="#"
								className="text-gray-400 transition-colors hover:text-white"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-gray-400 transition-colors hover:text-white"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-gray-400 transition-colors hover:text-white"
							>
								Cookie Policy
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="mb-4 font-semibold text-gray-100">プロダクト</h4>
						<ul className="space-y-3">
							<li>
								<a
									href="#"
									className="text-gray-400 transition-colors hover:text-white"
								>
									機能
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 transition-colors hover:text-white"
								>
									価格
								</a>
							</li>
							<li>
								<Link
									to="/dashboard"
									className="text-gray-400 transition-colors hover:text-white"
								>
									ダッシュボード
								</Link>
							</li>
							<li>
								<a
									href="/courses-list"
									className="text-gray-400 transition-colors hover:text-white"
								>
									マイコース
								</a>
							</li>
						</ul>
					</div>

					{/* Account */}
					<div>
						<h4 className="mb-4 font-semibold text-gray-100">アカウント</h4>
						<ul className="space-y-3">
							<li>
								<Link
									to="/sign-in"
									className="text-gray-400 transition-colors hover:text-white"
								>
									サインイン
								</Link>
							</li>
							<li>
								<Link
									to="/sign-up"
									className="text-gray-400 transition-colors hover:text-white"
								>
									サインアップ
								</Link>
							</li>
							<li>
								<Link
									to="/reset-password"
									className="text-gray-400 transition-colors hover:text-white"
								>
									パスワードのリセット
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="mb-4 font-semibold text-gray-100">サポート</h4>
						<ul className="space-y-3">
							<li>
								<a
									href="#help"
									className="text-gray-400 transition-colors hover:text-white"
								>
									ヘルプセンター
								</a>
							</li>
							<li>
								<a
									href="#contact"
									className="text-gray-400 transition-colors hover:text-white"
								>
									お問い合わせ
								</a>
							</li>
							<li>
								<a
									href="#faq"
									className="text-gray-400 transition-colors hover:text-white"
								>
									よくある質問
								</a>
							</li>
							<li>
								<a
									href="#feedback"
									className="text-gray-400 transition-colors hover:text-white"
								>
									フィードバック
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 border-gray-800 border-t pt-8">
					<div className="flex flex-col items-center justify-center gap-4 text-center text-gray-400 text-sm md:flex-row">
						<p>&copy; 2026 LMS. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

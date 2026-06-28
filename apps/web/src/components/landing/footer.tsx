import { Books } from "@lms-repo-edge-version/ui/assets/icons/books";
import { GithubLogo } from "@lms-repo-edge-version/ui/assets/icons/github-logo";

export function Footer() {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="flex items-center justify-around gap-3">
					{/* Company Info */}
					<div className="col-span-1 md:col-span-2 lg:col-span-2">
						<div className="mb-6">
							<h3 className="mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-2xl text-transparent">
								<Books width={32} height={32} />
								<p>LMS</p>
							</h3>
							<p className="mb-4 text-gray-400 leading-relaxed">
								大学生のための学習管理アプリケーション。
								時間割の作成、スケジュール・課題の管理機能を提供します。
							</p>
						</div>
					</div>

					{/* Social */}
					<div>
						<h4 className="mb-4 font-semibold text-gray-100">ソーシャル</h4>
						<ul className="space-y-3">
							<li>
								<a
									href="https://github.com/SrKtym/lms-repo-with-hono-and-tanstack/tree/3f65a0b863cae8548aed47d374e42e7f59eb6fc0"
									className="text-gray-400 transition-colors hover:text-white"
								>
									<div className="flex items-center gap-3">
										<GithubLogo width={20} height={20} />
										<p>GitHub</p>
									</div>
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 border-gray-800 border-t pt-8">
					<p className="text-center text-gray-400 text-sm">
						&copy; 2026 LMS. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

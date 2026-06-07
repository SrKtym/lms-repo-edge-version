import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import {
	DefaultButton,
	OutlineButton,
} from "@lms-repo-edge-version/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DeviceShowcase } from "@/components/landing/device-showcase";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { VideoTutorial } from "@/components/landing/video-tutorial";

export const Route = createFileRoute("/")({
	component: HomeComponent,
	head: () => ({
		meta: [
			{
				title: "ホーム | LMS-repo",
			},
		],
	}),
});

function HomeComponent() {
	return (
		<div className="flex min-h-screen flex-col">
			<HeroSection>
				<div className="flex items-center gap-6">
					<Link to="/sign-up">
						<OutlineButton size="lg" className="flex items-center gap-2">
							はじめての方
							<ArrowRight />
						</OutlineButton>
					</Link>
					<Link to="/dashboard">
						<DefaultButton size="lg" className="flex items-center gap-2">
							ダッシュボードへ
							<ArrowRight />
						</DefaultButton>
					</Link>
				</div>
			</HeroSection>
			<FeaturesSection />
			<DeviceShowcase />
			<VideoTutorial />
			<Footer />
		</div>
	);
}

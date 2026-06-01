import { ArrowRight } from "@lms-repo-edge-version/ui/assets/icons/arrow-right";
import { DefaultButton } from "@lms-repo-edge-version/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DeviceShowcase } from "@/components/landing/device-showcase";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { VideoTutorial } from "@/components/landing/video-tutorial";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="flex min-h-screen flex-col">
			<HeroSection>
				<Link to="/sign-in">
					<DefaultButton size="lg" className="flex items-center gap-2">
						はじめる
						<ArrowRight />
					</DefaultButton>
				</Link>
			</HeroSection>
			<FeaturesSection />
			<DeviceShowcase />
			<VideoTutorial />
			<Footer />
		</div>
	);
}

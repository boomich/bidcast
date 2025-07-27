import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";

import Hero from "@/components/blocks/heros/bc-hero";
import CreatorFeaturesGrid from "@/components/blocks/features/creator-features-grid";
import AudienceFeaturesGrid from "@/components/blocks/features/audience-features-grid";
import ContentCreationProcess from "@/components/blocks/process/content-creation-process";
import SimpleCenteredWithGradient from "@/components/blocks/ctas/simple-centered-with-gradient";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <Hero />
      <ContentCreationProcess />
      <CreatorFeaturesGrid />
      <AudienceFeaturesGrid />
      <SimpleCenteredWithGradient />
      <SimpleFooterWithFourGrids />
    </main>
  );
}

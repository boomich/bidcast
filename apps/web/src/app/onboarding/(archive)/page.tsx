import { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";

import Heading from "@/components/ui/bc-heading";
import { Navigation } from "@/components/layout";

import YouTubeChannelCheck from "./_YouTubeChannelCheck";
import YouTubeChannelLoading from "./_YouTubeChannelLoading";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <>
      <Navigation />
      <div className="container max-md:px-7 mx-auto flex flex-col gap-8 items-center pb-18 min-h-screen">
        <Heading
          className="my-24 max-md:mt-10 max-md:mb-9 text-center"
          title="Welcome to Bidcast"
          subtitle="Lets get you started."
          subtitleClassName="text-4xl md:text-5xl text-center"
        />

        <Suspense fallback={<YouTubeChannelLoading />}>
          <YouTubeChannelCheck />
        </Suspense>
      </div>
      <SimpleFooterWithFourGrids />
    </>
  );
}

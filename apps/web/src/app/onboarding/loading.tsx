import { Youtube } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@packages/ui/components/separator";
import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";

import Heading from "@/components/ui/bc-heading";
import Navbar from "@/components/blocks/bc-navbar";

export default function OnboardingLoading() {
  return (
    <>
      <Navbar />
      <div className="container max-md:px-7 mx-auto flex flex-col gap-8 items-center pb-18 min-h-screen">
        <Heading
          className="my-24 max-md:mt-10 max-md:mb-9 text-center"
          title="Welcome to Bidcast"
          subtitle="Lets get you started."
          subtitleClassName="text-4xl md:text-5xl text-center"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl justify-center font-bold flex items-baseline gap-2">
              Checking your YouTube channels...
            </h2>
            <Card className="p-8 gap-6 bg-card border-border">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Youtube className="w-8 h-8 text-muted-foreground animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Loading...</h3>
                  <p className="text-muted-foreground">
                    We're checking your Google account for YouTube channels.
                  </p>
                </div>
                <div className="w-full max-w-sm">
                  <div className="h-2 bg-muted rounded-full animate-pulse"></div>
                </div>
              </div>
            </Card>
          </div>

          <Separator
            orientation="horizontal"
            className="block md:hidden my-4"
          />

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-center font-bold flex items-baseline gap-2">
              Your other channels
            </h2>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <SimpleFooterWithFourGrids />
    </>
  );
}
import * as React from "react";
import { Suspense } from "react";
import YouTubeChannelsComponent from "@/components/onboarding/YouTubeChannelsComponent";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Bidcast</h1>

      <Suspense fallback={
        <div className="p-4 bg-gray-100 rounded">
          Loading YouTube channel information...
        </div>
      }>
        <YouTubeChannelsComponent />
      </Suspense>

      <OnboardingForm />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

import { completeOnboarding } from "./_actions";

import BidcastButton from "@/components/ui/bc-button";

export default function CompleteOnboardingButton() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);

    try {
      const res = await completeOnboarding();
      console.log("Complete onboarding response:", res);

      // Handle success case
      if (res.success) {
        console.log(
          "Onboarding completed successfully, refreshing session and redirecting to feed",
        );

        // Log current metadata state
        console.log(
          "Current user metadata before refresh:",
          user?.publicMetadata,
        );

        // Force session refresh to get updated metadata
        await getToken({ template: "convex" });

        // Force user object refresh
        await user?.reload();

        console.log("User metadata after refresh:", user?.publicMetadata);

        // Small delay to ensure session claims are updated
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("About to redirect to /feed");

        // Try hard redirect instead of router.replace
        window.location.href = "/feed";
        return;
      }

      // Handle error cases (both error and message are failures)
      if (res.error) {
        console.error("Onboarding error:", res.error);
      } else if (res.message) {
        console.error("Onboarding message:", res.message);
      } else {
        console.error("Unknown response from completeOnboarding:", res);
      }

      // Reset loading state on any non-success case
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsLoading(false);
    }
  };

  return (
    <BidcastButton variant="outline" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Completing..." : "Continue"}
    </BidcastButton>
  );
}

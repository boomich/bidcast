"use client";

import { useRouter } from "next/navigation";

import { completeOnboarding } from "./_actions";

import BidcastButton from "@/components/ui/bc-button";

export default function CompleteOnboardingButton() {
  const router = useRouter();
  const handleClick = async () => {
    const res = await completeOnboarding();
    if (res.error) {
      console.error(res.error);
    } else {
      console.log("Redirecting to feed");
      router.push("/feed");
    }
  };

  return (
    <BidcastButton variant="outline" onClick={handleClick}>
      Continue
    </BidcastButton>
  );
}

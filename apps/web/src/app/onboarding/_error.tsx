"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Error() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    console.warn("User not loaded or not signed in.");
    return;
  }
  const googleAccount = user.externalAccounts.find(
    (ea) => ea.provider === "google",
  );

  const reauthorize = async () => {
    if (!googleAccount) {
      console.warn("No Google account found.");
      return;
    }
    const reauthorizedAccount = await googleAccount.reauthorize({
      redirectUrl: `${window.location.origin}/oauth-callback`,
      // Add any additional scopes if needed for brand accounts, though
      // 'youtube.readonly' should generally cover it.
      // scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    });
    if (reauthorizedAccount.verification?.externalVerificationRedirectURL) {
      router.push(
        reauthorizedAccount.verification.externalVerificationRedirectURL.toString(),
      );
    } else {
      // This path might be hit if reauthorization occurs without a redirect,
      // or if the token is simply refreshed.
      console.log(
        "Google account reauthorized without redirect. Refreshing channels.",
      );
      // You might want to force a page refresh here or trigger a re-fetch
      router.refresh(); // For Next.js App Router
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred.
          <br />
          Please sign in again.
        </p>

        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={reauthorize}
          >
            <RefreshCw className="w-4 h-4" />
            Sign in again
          </Button>
        </div>
      </div>
    </div>
  );
}

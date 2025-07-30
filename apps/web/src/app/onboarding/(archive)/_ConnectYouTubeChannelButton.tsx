"use client"; // This directive makes it a Client Component

import React from "react";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { OAuthStrategy } from "@clerk/types";

interface ConnectYouTubeChannelButtonProps {
  onConnect?: () => void;
  onError?: (error: Error) => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export default function ConnectYouTubeChannelButton({
  asChild,
  children,
  onError,
  onConnect,
}: ConnectYouTubeChannelButtonProps) {
  const { user } = useUser();
  const router = useRouter();

  const connectNewChannelOrReauthorize = async () => {
    if (!user) {
      console.warn("User not loaded or not signed in.");
      return;
    }

    const googleAccount = user.externalAccounts.find(
      (ea) => ea.provider === "google",
    );

    if (!googleAccount) {
      // If no Google account is connected,
      // initiate the first connection (original createExternalAccount logic)
      try {
        const externalAccount = await user.createExternalAccount({
          strategy: "oauth_google" as OAuthStrategy,
          redirectUrl: `${window.location.origin}/oauth-callback`,
        });
        if (externalAccount.verification?.externalVerificationRedirectURL) {
          router.push(
            externalAccount.verification.externalVerificationRedirectURL.toString(),
          );
        }
      } catch (error) {
        console.error("Error connecting first Google account:", error);
        alert(`Failed to connect Google account. Please try again. ${error}`);
      }
    } else {
      // If a Google account is already connected, try to reauthorize it.
      // This should trigger Google's consent screen again,
      // allowing the user to pick a different YouTube identity (Brand Account).
      try {
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
          // router.refresh(); // For Next.js App Router
        }
      } catch (error) {
        console.error(
          "Error reauthorizing Google account for new YouTube channel:",
          error,
        );
        // The user might have declined, or there's another issue.
        // Check for specific error codes if available.
        alert(
          "Failed to connect another YouTube channel. Make sure you select a different YouTube identity on Google's screen, or that you have another Brand Account.",
        );
      }
    }
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: connectNewChannelOrReauthorize,
    });
  }

  return (
    <button
      onClick={connectNewChannelOrReauthorize}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Connect Another YouTube Channel
    </button>
  );
}

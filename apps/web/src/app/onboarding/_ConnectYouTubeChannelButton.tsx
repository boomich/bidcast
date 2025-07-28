"use client"; // This directive makes it a Client Component

import { useUser } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "next/navigation"; // Use next/navigation for client-side routing

export function ConnectYouTubeChannelButton() {
  const { user } = useUser();
  const router = useRouter();

  const connectNewChannel = async () => {
    if (!user) {
      console.warn("User not loaded or not signed in.");
      return;
    }

    try {
      // Initiate a new OAuth flow for Google.
      // The user will be redirected to Google's consent screen.
      // `redirectUrl` is the URL the OAuth provider (Google) redirects back to.
      // This should be your Clerk OAuth callback route.
      const externalAccount = await user.createExternalAccount({
        strategy: "oauth_google" as OAuthStrategy,
        redirectUrl: `${window.location.origin}/oauth-callback`, // This is the only redirect URL for createExternalAccount
        // 'redirectUrlComplete' is not a valid parameter here.
        // The *final* redirect after Clerk processes the OAuth will be handled by:
        // 1. The <AuthenticateWithRedirectCallback /> component on /oauth-callback,
        //    via its `afterSignInUrl`/`afterSignUpUrl` props, or
        // 2. Clerk environment variables (recommended), like CLERK_AFTER_SIGN_IN_URL/CLERK_AFTER_SIGN_UP_URL,
        //    or CLERK_SIGN_IN_FORCE_REDIRECT_URL/CLERK_SIGN_UP_FORCE_REDIRECT_URL
      });

      // This is still correct: Redirect the user to Google for authorization
      if (externalAccount.verification?.externalVerificationRedirectURL) {
        router.push(
          externalAccount.verification.externalVerificationRedirectURL.toString(),
        );
      }
    } catch (error) {
      console.error("Error connecting new YouTube channel:", error);
      // Handle error (e.g., show a toast message to the user)
    }
  };

  return (
    <button
      onClick={connectNewChannel}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Connect Another YouTube Channel
    </button>
  );
}

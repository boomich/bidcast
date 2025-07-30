import { Suspense } from "react";

import { Youtube } from "lucide-react";
import { redirect } from "next/navigation";
import { fetchMutation } from "convex/nextjs";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { getAuthToken } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { api } from "@packages/backend/convex/_generated/api";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

import CompleteOnboardingButton from "./_complete-onboarding";
import Error from "./_error";

const loadingStates = [
  {
    text: "Connecting your YouTube channel",
  },
  {
    text: "Analyzing channel data",
  },
  {
    text: "Setting up your profile",
  },
  {
    text: "Configuring preferences",
  },
  {
    text: "Initializing dashboard",
  },
  {
    text: "Finalizing setup",
  },
];

export default async function OnboardingPage() {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <YouTubeChannelCheck />
    </Suspense>
  );
}

const SuspenseLoader = async () => {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={true} duration={2000} />

      {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
      <BackgroundGradientAnimation
        containerClassName="absolute opacity-30"
        gradientBackgroundStart="rgb(108, 0, 162)"
        gradientBackgroundEnd="rgb(0, 17, 82)"
        firstColor="var(--color-primary)"
        secondColor="221, 74, 255"
        size="100%"
        thirdColor="100, 220, 255"
      />
    </div>
  );
};

const YouTubeChannelCheck = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const client = await clerkClient();
  let OauthChannel: any = null;
  let error: string | null = null;

  try {
    // Check if user has Google OAuth token
    const oauthTokens = await client.users.getUserOauthAccessToken(
      user.id,
      "google",
    );

    if (!oauthTokens.data || oauthTokens.data.length === 0) {
      error =
        "No Google account connected. Please connect your Google account first.";
    } else {
      const accessToken = oauthTokens.data[0];

      if (!accessToken?.token) {
        error =
          "Invalid or expired Google access token. Please reconnect your Google account.";
      } else {
        const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&mine=true`;
        const response = await fetch(youtubeApiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.error(
            `YouTube API error: ${response.status} ${response.statusText}`,
            responseText,
          );
          error = `Failed to fetch YouTube data: ${response.status} ${response.statusText}`;
        } else {
          const youtubeData = await response.json();
          OauthChannel = youtubeData.items?.[0];

          if (!OauthChannel) {
            error = "No YouTube channel found for this Google account.";
          }
        }
      }
    }
  } catch (err: any) {
    console.error("OAuth/YouTube Error:", err);

    // Handle specific Clerk errors
    if (err.status === 422) {
      error =
        "Google account not connected to your Clerk account. Please connect your Google account.";
    } else if (err.clerkError) {
      error = `Authentication error: ${err.errors?.[0]?.message || err.message || "Unknown error"}`;
    } else {
      error = `Unexpected error: ${err.message || "Unknown error occurred"}`;
    }
  }

  // Show error state or success state
  if (error) {
    return <Error />;
  }

  const convexToken = await getAuthToken();

  const userId = await fetchMutation(
    api.users.createUser,
    {
      role: OauthChannel ? "creator" : "fan",
    },
    { token: convexToken },
  );

  if (!OauthChannel) {
    return (
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <Card className="p-8 gap-6 bg-card border-border text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Youtube className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                No YouTube Channel Found
              </h3>
              <p className="text-muted-foreground">
                We couldn't find any YouTube channels associated with your
                Google account. You can continue to Bidcast and connect a
                channel later.
              </p>
            </div>
            <CompleteOnboardingButton />
          </div>
        </Card>
      </div>
    );
  }

  const creatorId = await fetchMutation(
    api.creators.createCreator,
    {
      userId: userId,
    },
    { token: convexToken },
  );

  console.log("CREATOR ID =>", creatorId);

  await fetchMutation(
    api.channels.createChannel,
    {
      bio: OauthChannel.snippet.description,
      url: OauthChannel.snippet.customUrl,
      title: OauthChannel.snippet.title,
      channelId: OauthChannel.id,
      thumbnail: OauthChannel.snippet.thumbnails.medium.url,
      coverImage: OauthChannel.snippet.thumbnails.medium.url,
      creatorId: creatorId._id,
    },
    { token: convexToken },
  );
  const res = await client.users.updateUser(user.id, {
    // Keep onboardingComplete in publicMetadata for middleware check
    publicMetadata: {
      onboardingComplete: true,
    },
  });
  redirect("/feed");

  return <pre>{JSON.stringify(OauthChannel, null, 2)}</pre>;
};

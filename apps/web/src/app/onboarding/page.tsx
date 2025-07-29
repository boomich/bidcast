import { Youtube } from "lucide-react";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

import Image from "next/image";

import { Card, Separator } from "@/components/ui";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "@/lib/auth";
import { api } from "@packages/backend/convex/_generated/api";
import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";

import Heading from "@/components/ui/bc-heading";
import { Navigation } from "@/components/layout";
import BidcastButton from "@/components/ui/bc-button";
import CompleteOnboardingButton from "./_CompleteOnboarding";

import OtherChannels from "./_OtherChannels";
import ConnectYouTubeChannelButton from "./_ConnectYouTubeChannelButton";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const client = await clerkClient();
  let accessToken: string | undefined = undefined;
  try {
    accessToken = (
      await client.users.getUserOauthAccessToken(user.id, "google")
    ).data[0]?.token;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    return <UserButton />;
  }

  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&mine=true`;

  const response = await fetch(youtubeApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store", // Ensure fresh data
  });

  const OauthChannel = (await response.json()).items?.[0];

  // Retrieve a Clerk-issued JWT with the "convex" template so we can run
  // authenticated Convex mutations from this Server Component.
  const convexToken = await getAuthToken();

  await fetchMutation(api.users.storeUser, {}, { token: convexToken });

  await fetchMutation(
    api.channels.createChannel,
    {
      clerkUserId: user.id,
      clerkExternalAccountId:
        // @ts-ignore
        user.raw?.external_accounts?.[0]?.external_account_id ?? "",
      channelId: OauthChannel.id,
      channelTitle: OauthChannel.snippet.title,
      channelUrl: OauthChannel.snippet.customUrl,
      channelThumbnail: OauthChannel.snippet.thumbnails.medium.url,
    },
    { token: convexToken },
  );

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

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl justify-center font-bold flex items-baseline gap-2">
              Your active YouTube channel
            </h2>
            <Card className="p-4 gap-4 bg-card border-border hover:border-primary/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden bg-muted">
                  <Image
                    src={OauthChannel.snippet.thumbnails.medium.url}
                    alt={OauthChannel.snippet.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <h4 className="font-inter leading-tight text-secondary text-2xl">
                    {OauthChannel.snippet.title}
                  </h4>
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">
                        {OauthChannel.statistics.subscriberCount} subscribers
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        {OauthChannel.statistics.videoCount} videos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl justify-center font-bold flex items-baseline gap-2">
              Connect more channels
            </h2>
            <OtherChannels except={OauthChannel.id} />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl justify-center font-bold flex items-baseline gap-2">
            Next steps
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <ConnectYouTubeChannelButton />
            <CompleteOnboardingButton />
          </div>
        </div>
      </div>
      <SimpleFooterWithFourGrids />
    </>
  );
}

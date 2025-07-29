import { Youtube } from "lucide-react";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

import Image from "next/image";

import { Card } from "@/components/ui/card";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "@/lib/auth";
import { api } from "@packages/backend/convex/_generated/api";
import { Separator } from "@packages/ui/components/separator";
import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";

import Heading from "@/components/ui/bc-heading";
import Navbar from "@/components/blocks/bc-navbar";
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

  const youtubeData = await response.json();
  const OauthChannel = youtubeData.items?.[0];

  // Retrieve a Clerk-issued JWT with the "convex" template so we can run
  // authenticated Convex mutations from this Server Component.
  const convexToken = await getAuthToken();

  await fetchMutation(api.users.storeUser, {}, { token: convexToken });

  // Only create channel if user has YouTube channels
  if (OauthChannel) {
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
  }

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

        {OauthChannel ? (
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
                      <p className="text-sm text-muted-foreground">
                        {OauthChannel.snippet.customUrl}
                      </p>
                    </div>
                    <div className="flex justify-between gap-2">
                      <p className="text-sm text-muted-foreground">
                        {OauthChannel.statistics.videoCount} videos •{" "}
                        {OauthChannel.statistics.subscriberCount} subscribers •{" "}
                        {OauthChannel.statistics.viewCount} views
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="mb-2" />
                <div className="flex flex-col justify-between gap-2">
                  <ConnectYouTubeChannelButton asChild>
                    <BidcastButton>Add another channel</BidcastButton>
                  </ConnectYouTubeChannelButton>
                  <CompleteOnboardingButton />
                </div>
              </Card>
            </div>

            <Separator
              orientation="horizontal"
              className="block md:hidden my-4"
            />

            <OtherChannels except={OauthChannel.id} />
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl">
            <Card className="p-8 gap-6 bg-card border-border">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Youtube className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">No YouTube Channel Found</h2>
                  <p className="text-muted-foreground">
                    It looks like your Google account doesn't have any YouTube channels associated with it. 
                    To use Bidcast, you'll need to create a YouTube channel first.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  <ConnectYouTubeChannelButton asChild>
                    <BidcastButton className="w-full">
                      Connect YouTube Channel
                    </BidcastButton>
                  </ConnectYouTubeChannelButton>
                  <CompleteOnboardingButton />
                  <a 
                    href="https://support.google.com/youtube/answer/1646861?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    How to create a YouTube channel →
                  </a>
                </div>
              </div>
            </Card>
          </div>
        )}
        {/* <div className="text-sm max-w-3xl border-2 text-secondary">
          <pre className="flex flex-col gap-2">
            <span className="text-sm flex-wrap wrap-anywhere whitespace-break-spaces text-secondary">
              {JSON.stringify(user, null, 2)}
            </span>
          </pre>
        </div> */}
      </div>
      <SimpleFooterWithFourGrids />
    </>
  );
}

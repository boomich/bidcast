import { Youtube } from "lucide-react";
import { redirect } from "next/navigation";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/auth";
import { api } from "@packages/backend/convex/_generated/api";
import { Separator } from "@packages/ui/components/separator";

import BidcastButton from "@/components/ui/bc-button";
import CompleteOnboardingButton from "./_CompleteOnboarding";
import ConnectYouTubeChannelButton from "./_ConnectYouTubeChannelButton";
import { completeOnboarding } from "./_actions";

export default async function YouTubeChannelCheck() {
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
    throw new Error("Failed to get YouTube access token");
  }

  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&mine=true`;

  const response = await fetch(youtubeApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube data");
  }

  const youtubeData = await response.json();
  const OauthChannel = youtubeData.items?.[0];

  // Retrieve a Clerk-issued JWT with the "convex" template
  const convexToken = await getAuthToken();

  await fetchMutation(
    api.users.createUser,
    {},
    // { token: convexToken }
  );

  // If user has no YouTube channels, show continue flow
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

  // Create channel if user has YouTube channels
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

  // Get other channels from database
  const allChannels = await fetchQuery(
    api.channels.getChannels,
    {},
    { token: convexToken },
  );

  const otherChannels = allChannels.filter(
    (channel) => channel.channelId !== OauthChannel.id,
  );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main YouTube Channel */}
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

      {/* Other Channels - only show if there are more than 1 total */}
      {otherChannels.length > 0 && (
        <>
          <Separator
            orientation="horizontal"
            className="block md:hidden my-4"
          />
          <Separator
            orientation="vertical"
            className="max-md:hidden h-[80%!important] mx-4 my-auto"
          />
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-center font-bold flex items-baseline gap-2">
              Your other channels
            </h2>
            {otherChannels.map((channel, index) => (
              <ConnectYouTubeChannelButton asChild key={index}>
                <Card className="p-4 bg-card border-border hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={channel.channelThumbnail}
                        alt={channel.channelTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">
                        {channel.channelTitle}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {channel.channelUrl}
                      </p>
                    </div>
                    <Youtube className="h-5 w-5 mx-2 text-primary" />
                  </div>
                </Card>
              </ConnectYouTubeChannelButton>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

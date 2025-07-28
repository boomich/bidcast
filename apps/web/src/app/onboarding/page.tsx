import { Youtube } from "lucide-react";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

import Image from "next/image";

import { Card } from "@/components/ui/card";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken } from "@/lib/auth";
import { api } from "@packages/backend/convex/_generated/api";

import Heading from "@/components/ui/bc-heading";
import Navbar from "@/components/blocks/bc-navbar";
import BidcastButton from "@/components/ui/bc-button";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  console.log("CURRENT USER", user);

  const client = await clerkClient();
  let accessToken: string | undefined = undefined;
  try {
    accessToken = (
      await client.users.getUserOauthAccessToken(user.id, "google")
    ).data[0]?.token;
  } catch (error) {
    console.error(error);
    return <UserButton />;
  }

  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&mine=true`;

  const response = await fetch(youtubeApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store", // Ensure fresh data
  });

  const OauthChannel = (await response.json()).items[0];

  // Retrieve a Clerk-issued JWT with the "convex" template so we can run
  // authenticated Convex mutations from this Server Component.
  const convexToken = await getAuthToken();

  await fetchMutation(api.users.storeUser, {}, { token: convexToken });

  await fetchMutation(
    api.channels.createChannel,
    {
      youtubeChannelId: OauthChannel.id,
      channelName: OauthChannel.snippet.title,
      channelUrl: OauthChannel.snippet.customUrl,
    },
    { token: convexToken },
  );

  return (
    <>
      <Navbar />
      <div className="container max-md:px-7 mx-auto flex flex-col gap-8 items-center h-screen">
        <Heading
          className="my-18 max-md:mb-9 text-center"
          title="Welcome to Bidcast"
          subtitle="Lets get you started."
          subtitleClassName="text-4xl md:text-5xl text-center"
        />
        <h2 className="text-2xl font-bold flex items-baseline gap-2">
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
            <BidcastButton>Add another channel</BidcastButton>
            <BidcastButton variant="outline">Continue</BidcastButton>
          </div>
        </Card>

        <div className="text-sm max-w-2xl border-2 text-secondary">
          <pre className="flex flex-col gap-2">
            <span className="text-sm text-secondary">
              {JSON.stringify(user, null, 2)}
            </span>
          </pre>
        </div>
      </div>
    </>
  );
}

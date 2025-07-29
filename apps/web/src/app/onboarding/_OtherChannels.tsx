import { Youtube } from "lucide-react";
import { fetchQuery } from "convex/nextjs";

import Image from "next/image";

import { getAuthToken } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Separator } from "@packages/ui/components/separator";
import { api } from "@packages/backend/convex/_generated/api";

import ConnectYouTubeChannelButton from "./_ConnectYouTubeChannelButton";

export default async function OtherChannels({ except }: { except: string }) {
  const convexToken = await getAuthToken();
  const channels = await fetchQuery(
    api.channels.getChannels,
    {},
    { token: convexToken },
  );

  if (channels.length === 1) {
    return null;
  }

  return (
    <>
      <Separator
        orientation="vertical"
        className="max-md:hidden h-[80%!important] mx-4 my-auto"
      />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-center font-bold flex items-baseline gap-2">
          Your other channels
        </h2>
        {channels
          .filter((channel) => channel.channelId !== except)
          .map((channel, index) => (
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
  );
}

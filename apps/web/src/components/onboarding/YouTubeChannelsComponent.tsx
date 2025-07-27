import { currentUser, clerkClient } from "@clerk/nextjs/server";

interface YouTubeChannelInfo {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: any;
  country?: string;
  defaultLanguage?: string;
  statistics: {
    viewCount: number;
    subscriberCount: number;
    videoCount: number;
  };
  branding: {
    bannerImageUrl?: string;
    keywords?: string;
  };
  uploadsPlaylistId: string;
}

interface YouTubeResponse {
  success?: boolean;
  channels?: YouTubeChannelInfo[];
  totalChannels?: number;
  error?: string;
}

async function getGoogleAccessToken(): Promise<string | null> {
  const user = await currentUser();
  if (!user) return null;
  
  const client = await clerkClient();
  const tokens = (await client.users.getUserOauthAccessToken(user.id, "google")).data;

  return Array.isArray(tokens) && tokens.length > 0 && tokens[0]?.token
    ? tokens[0].token
    : null;
}

async function getAllYoutubeChannels(): Promise<YouTubeResponse> {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    return { error: "No access token available. Please reconnect your Google account." };
  }

  try {
    // Get ALL YouTube channels for the user
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      console.error("YouTube API error:", response.status, response.statusText);
      if (response.status === 401) {
        return { error: "YouTube access token expired. Please reconnect your Google account." };
      }
      return { error: `YouTube API error: ${response.status}` };
    }

    const data = await response.json();

    // If user has no YouTube channels, return appropriate message
    if (!data.items || data.items.length === 0) {
      return { error: "No YouTube channels found for this Google account. Please make sure you have a YouTube channel associated with your account." };
    }

    // Extract information for ALL channels
    const channels = data.items.map((channel: any) => ({
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      customUrl: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
      thumbnails: channel.snippet.thumbnails,
      country: channel.snippet.country,
      defaultLanguage: channel.snippet.defaultLanguage,
      statistics: {
        viewCount: parseInt(channel.statistics.viewCount || "0"),
        subscriberCount: parseInt(channel.statistics.subscriberCount || "0"),
        videoCount: parseInt(channel.statistics.videoCount || "0"),
      },
      branding: {
        bannerImageUrl: channel.brandingSettings?.image?.bannerExternalUrl,
        keywords: channel.brandingSettings?.channel?.keywords,
      },
      uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads,
    }));

    return { success: true, channels, totalChannels: channels.length };
  } catch (error) {
    console.error("Error fetching YouTube info:", error);
    return { error: "Failed to fetch YouTube channel information. Please try again." };
  }
}

export default async function YouTubeChannelsComponent() {
  const youtubeInfo = await getAllYoutubeChannels();

  if (!youtubeInfo) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        Loading YouTube channel information...
      </div>
    );
  }

  if (youtubeInfo.error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>YouTube Channel Error:</strong> {youtubeInfo.error}
        <div className="mt-2 text-sm">
          {youtubeInfo.error.includes("access token") && (
            <p>You may need to reconnect your Google account with the proper YouTube permissions.</p>
          )}
        </div>
      </div>
    );
  }

  if (
    youtubeInfo.success &&
    youtubeInfo.channels &&
    youtubeInfo.channels.length > 0
  ) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="text-lg font-bold text-green-800 mb-2">
            {youtubeInfo.totalChannels === 1
              ? "YouTube Channel Found!"
              : `${youtubeInfo.totalChannels} YouTube Channels Found!`}
          </h3>
          {youtubeInfo.totalChannels! > 1 && (
            <p className="text-green-700 text-sm mb-4">
              All your YouTube channels will be saved. You can select which one to use as your primary channel:
            </p>
          )}
        </div>

        {/* Pass the channels data to the client component via a script tag for better hydration */}
        <script
          type="application/json"
          id="youtube-channels-data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(youtubeInfo)
          }}
        />

        <div className="space-y-3">
          {youtubeInfo.channels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 border-2 border-gray-200 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                {channel.thumbnails?.default?.url && (
                  <img
                    src={channel.thumbnails.default.url}
                    alt={channel.title}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{channel.title}</h4>
                  {channel.customUrl && (
                    <p className="text-sm text-gray-500">{channel.customUrl}</p>
                  )}
                  <div className="mt-2 grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">
                        {channel.statistics.subscriberCount.toLocaleString()}
                      </span>
                      <br />
                      subscribers
                    </div>
                    <div>
                      <span className="font-medium">
                        {channel.statistics.videoCount.toLocaleString()}
                      </span>
                      <br />
                      videos
                    </div>
                    <div>
                      <span className="font-medium">
                        {channel.statistics.viewCount.toLocaleString()}
                      </span>
                      <br />
                      total views
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-100 rounded">
      Unable to load YouTube channel information.
    </div>
  );
}
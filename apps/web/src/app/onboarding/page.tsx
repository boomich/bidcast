"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding, getAllYoutubeChannels } from "./_actions";

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

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();
  const [youtubeInfo, setYoutubeInfo] = React.useState<YouTubeResponse | null>(
    null,
  );
  const [selectedChannelId, setSelectedChannelId] = React.useState<string>("");

  React.useEffect(() => {
    const fetchYoutubeInfo = async () => {
      const info = await getAllYoutubeChannels();
      setYoutubeInfo(info);
      // Auto-select the first channel if only one exists
      if (info?.success && info.channels && info.channels.length === 1) {
        setSelectedChannelId(info.channels[0].id);
      }
    };
    fetchYoutubeInfo();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    // Add selected channel ID to form data
    if (selectedChannelId) {
      formData.append("activeYouTubeChannelId", selectedChannelId);
    }

    const res = await completeOnboarding(formData);
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload();
      router.push("/");
    }
    if (res?.error) {
      setError(res?.error);
    }
  };

  const renderChannelCard = (channel: YouTubeChannelInfo) => (
    <div
      key={channel.id}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        selectedChannelId === channel.id
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => setSelectedChannelId(channel.id)}
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
        {selectedChannelId === channel.id && (
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderYouTubeInfo = () => {
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
                Select the channel you want to use as your primary channel for
                Content Pilot:
              </p>
            )}
          </div>

          <div className="space-y-3">
            {youtubeInfo.channels.map(renderChannelCard)}
          </div>

          {youtubeInfo.totalChannels! > 1 && !selectedChannelId && (
            <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
              Please select a channel to continue with the onboarding process.
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-4 bg-yellow-100 rounded">
        Unable to load YouTube channel information.
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Bidcast</h1>

      {renderYouTubeInfo()}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Name
          </label>
          <p className="text-sm text-gray-500">
            Enter the name of your application.
          </p>
          <input
            type="text"
            name="applicationName"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Type
          </label>
          <p className="text-sm text-gray-500">
            Describe the type of your application.
          </p>
          <input
            type="text"
            name="applicationType"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm">Error: {error}</p>}

        {/* Show warning if multiple channels exist but none selected */}
        {youtubeInfo?.success &&
          youtubeInfo.totalChannels! > 1 &&
          !selectedChannelId && (
            <p className="text-amber-600 text-sm">
              Please select a YouTube channel above to continue.
            </p>
          )}

        <button
          type="submit"
          disabled={
            youtubeInfo?.success &&
            youtubeInfo.totalChannels! > 1 &&
            !selectedChannelId
          }
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            youtubeInfo?.success &&
            youtubeInfo.totalChannels! > 1 &&
            !selectedChannelId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Complete Onboarding
        </button>
      </form>

      {/* Debug information - remove in production */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          Debug: Raw YouTube Data
        </summary>
        <pre className="mt-2 text-xs  p-2 rounded overflow-auto">
          {JSON.stringify(youtubeInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
}

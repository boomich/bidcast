"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/app/onboarding/_actions";
import ChannelSelector from "./ChannelSelector";

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

export default function OnboardingForm() {
  const [error, setError] = React.useState("");
  const [selectedChannelId, setSelectedChannelId] = React.useState<string>("");
  const [youtubeChannels, setYoutubeChannels] = React.useState<YouTubeChannelInfo[]>([]);
  const [youtubeData, setYoutubeData] = React.useState<string>("");
  const { user } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    // Get YouTube data from the script tag in the server component
    const youtubeDataScript = document.getElementById('youtube-channels-data') as HTMLScriptElement;
    if (youtubeDataScript?.textContent) {
      setYoutubeData(youtubeDataScript.textContent);
      try {
        const parsedData = JSON.parse(youtubeDataScript.textContent);
        if (parsedData.success && parsedData.channels) {
          setYoutubeChannels(parsedData.channels);
          // Auto-select the first channel if only one exists
          if (parsedData.channels.length === 1) {
            setSelectedChannelId(parsedData.channels[0].id);
          }
        }
      } catch (parseError) {
        console.error("Error parsing YouTube data:", parseError);
      }
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    // Add selected channel ID and YouTube data to form data
    if (selectedChannelId) {
      formData.append("activeYouTubeChannelId", selectedChannelId);
    }
    if (youtubeData) {
      formData.append("youtubeChannelsData", youtubeData);
    }

    try {
      const res = await completeOnboarding(formData);
      if (res?.message) {
        // Reloads the user's data from the Clerk API
        await user?.reload();
        router.push("/");
      }
      if (res?.error) {
        setError(res.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const isFormDisabled = youtubeChannels.length > 1 && !selectedChannelId;

  return (
    <div className="space-y-6">
      {/* Channel Selector */}
      {youtubeChannels.length > 1 && (
        <ChannelSelector
          channels={youtubeChannels}
          selectedChannelId={selectedChannelId}
          onChannelSelect={setSelectedChannelId}
        />
      )}

      {/* Form */}
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
        {isFormDisabled && (
          <p className="text-amber-600 text-sm">
            Please select a YouTube channel above to continue.
          </p>
        )}

        <button
          type="submit"
          disabled={isFormDisabled}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isFormDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Complete Onboarding
        </button>
      </form>
    </div>
  );
}
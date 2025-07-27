import { auth } from "@clerk/nextjs/server";
import { api } from "@packages/backend/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import ChannelSettingsClient from "./ChannelSettingsClient";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function YouTubeChannelSettings() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">Please sign in to view your YouTube channels.</p>
      </div>
    );
  }

  try {
    // Get all YouTube channels from Convex
    const channels = await convex.query(api.userProfiles.getUserYouTubeChannels, {
      userId,
    });

    if (!channels || channels.length === 0) {
      return (
        <div className="text-center p-6">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No YouTube Channels Found</h3>
          <p className="text-gray-500 mb-4">
            You don't have any YouTube channels connected to your account yet.
          </p>
          <a 
            href="/onboarding" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Set up YouTube channels
          </a>
        </div>
      );
    }

    return <ChannelSettingsClient channels={channels} userId={userId} />;
  } catch (error) {
    console.error("Error fetching YouTube channels:", error);
    return (
      <div className="text-center p-6">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Channels</h3>
        <p className="text-gray-500 mb-4">
          There was an error loading your YouTube channels. Please try refreshing the page.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Refresh Page
        </button>
      </div>
    );
  }
}
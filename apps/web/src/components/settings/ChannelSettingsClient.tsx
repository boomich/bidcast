"use client";

import * as React from "react";
import { setActiveYouTubeChannel } from "@/app/onboarding/_actions";

interface YouTubeChannel {
  _id: string;
  userId: string;
  channelId: string;
  title: string;
  description?: string;
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
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ChannelSettingsClientProps {
  channels: YouTubeChannel[];
  userId: string;
}

export default function ChannelSettingsClient({ channels, userId }: ChannelSettingsClientProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleSetActiveChannel = async (channelId: string) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await setActiveYouTubeChannel(channelId);
      
      if (result.success) {
        setSuccessMessage("Active channel updated successfully!");
        // Refresh the page to reflect the changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.error || "Failed to update active channel");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const activeChannel = channels.find(channel => channel.isActive);

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Channel Summary */}
      {activeChannel && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Currently Active Channel</h3>
          <div className="flex items-center space-x-3">
            {activeChannel.thumbnails?.default?.url && (
              <img
                src={activeChannel.thumbnails.default.url}
                alt={activeChannel.title}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-blue-900">{activeChannel.title}</p>
              {activeChannel.customUrl && (
                <p className="text-sm text-blue-700">{activeChannel.customUrl}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Channel List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">All Your YouTube Channels</h3>
        
        <div className="grid gap-4">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className={`border rounded-lg p-4 transition-all ${
                channel.isActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {channel.thumbnails?.default?.url && (
                    <img
                      src={channel.thumbnails.default.url}
                      alt={channel.title}
                      className="w-16 h-16 rounded-full flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        {channel.title}
                      </h4>
                      {channel.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                    </div>
                    
                    {channel.customUrl && (
                      <p className="text-sm text-gray-600 mb-2">{channel.customUrl}</p>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">
                          {formatNumber(channel.statistics.subscriberCount)}
                        </span>
                        <br />
                        <span className="text-xs">subscribers</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {formatNumber(channel.statistics.videoCount)}
                        </span>
                        <br />
                        <span className="text-xs">videos</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {formatNumber(channel.statistics.viewCount)}
                        </span>
                        <br />
                        <span className="text-xs">total views</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {formatDate(channel.publishedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  {!channel.isActive && (
                    <button
                      onClick={() => handleSetActiveChannel(channel.channelId)}
                      disabled={isLoading}
                      className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                        isLoading
                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      }`}
                    >
                      {isLoading ? "Setting..." : "Set as Active"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">About YouTube Channel Management</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Your active channel is used for all YouTube-related features in the app</li>
          <li>• You can switch between channels at any time</li>
          <li>• Channel data is automatically synced and updated</li>
          <li>• To add more channels, reconnect your Google account with additional permissions</li>
        </ul>
      </div>
    </div>
  );
}
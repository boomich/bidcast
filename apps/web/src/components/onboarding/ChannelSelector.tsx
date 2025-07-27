"use client";

import * as React from "react";

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

interface ChannelSelectorProps {
  channels: YouTubeChannelInfo[];
  selectedChannelId: string;
  onChannelSelect: (channelId: string) => void;
}

export default function ChannelSelector({ 
  channels, 
  selectedChannelId, 
  onChannelSelect 
}: ChannelSelectorProps) {
  if (channels.length <= 1) {
    return null; // Don't show selector if only one or no channels
  }

  const renderChannelCard = (channel: YouTubeChannelInfo) => (
    <div
      key={channel.id}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        selectedChannelId === channel.id
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onChannelSelect(channel.id)}
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

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-100 border border-blue-400 rounded">
        <h3 className="text-lg font-bold text-blue-800 mb-2">
          Select Your Primary Channel
        </h3>
        <p className="text-blue-700 text-sm">
          Choose which YouTube channel you want to use as your primary channel. 
          You can change this later in your settings.
        </p>
      </div>

      <div className="space-y-3">
        {channels.map(renderChannelCard)}
      </div>

      {!selectedChannelId && (
        <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          Please select a channel to continue with the onboarding process.
        </div>
      )}
    </div>
  );
}
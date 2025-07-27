"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { api } from "@packages/backend/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const applicationName = formData.get("applicationName") as string;
    const applicationType = formData.get("applicationType") as string;
    const activeYouTubeChannelId = formData.get("activeYouTubeChannelId") as string;
    const youtubeChannelsData = formData.get("youtubeChannelsData") as string;

    // Parse YouTube channels data if available
    let channels = [];
    if (youtubeChannelsData) {
      try {
        const parsedData = JSON.parse(youtubeChannelsData);
        if (parsedData.success && parsedData.channels) {
          channels = parsedData.channels.map((channel: any) => ({
            channelId: channel.id,
            title: channel.title,
            description: channel.description || "",
            customUrl: channel.customUrl,
            publishedAt: channel.publishedAt,
            thumbnails: channel.thumbnails,
            country: channel.country,
            defaultLanguage: channel.defaultLanguage,
            statistics: channel.statistics,
            branding: channel.branding,
            uploadsPlaylistId: channel.uploadsPlaylistId,
            isActive: channel.id === activeYouTubeChannelId,
          }));
        }
      } catch (parseError) {
        console.error("Error parsing YouTube channels data:", parseError);
      }
    }

    // Save to Convex
    await convex.mutation(api.userProfiles.upsertUserProfile, {
      userId,
      applicationName,
      applicationType,
      activeYouTubeChannelId,
      onboardingComplete: true,
    });

    // Save YouTube channels to Convex if available
    if (channels.length > 0) {
      await convex.mutation(api.userProfiles.saveYouTubeChannels, {
        userId,
        channels,
      });
    }

    // Update Clerk for middleware compatibility
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
      privateMetadata: {
        applicationName,
        applicationType,
        activeYouTubeChannelId,
      },
    });

    return { message: "Onboarding completed successfully" };
  } catch (err) {
    console.error("Error completing onboarding:", err);
    return { error: "There was an error updating the user metadata." };
  }
};

export const setActiveYouTubeChannel = async (channelId: string) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No Logged In User" };
  }

  try {
    // Update in Convex
    const result = await convex.mutation(api.userProfiles.setActiveYouTubeChannel, {
      userId,
      channelId,
    });

    if (result.success) {
      // Also update Clerk for backward compatibility
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      await client.users.updateUser(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          activeYouTubeChannelId: channelId,
        },
      });

      return { success: true, activeChannelId: channelId };
    } else {
      return { error: result.error || "Failed to update active channel" };
    }
  } catch (err) {
    console.error("Error setting active YouTube channel:", err);
    return { error: "There was an error updating the active channel." };
  }
};

// New function to get user's YouTube channels from Convex
export const getUserYouTubeChannelsFromConvex = async () => {
  const { userId } = await auth();
  if (!userId) {
    return { error: "No Logged In User" };
  }

  try {
    const channels = await convex.query(api.userProfiles.getUserYouTubeChannels, {
      userId,
    });
    
    return { success: true, channels };
  } catch (err) {
    console.error("Error getting user YouTube channels:", err);
    return { error: "Failed to get YouTube channels" };
  }
};

// New function to get active YouTube channel from Convex
export const getActiveYouTubeChannelFromConvex = async () => {
  const { userId } = await auth();
  if (!userId) {
    return { error: "No Logged In User" };
  }

  try {
    const channel = await convex.query(api.userProfiles.getActiveYouTubeChannel, {
      userId,
    });
    
    if (channel) {
      return { success: true, channel };
    } else {
      return { error: "No active channel found" };
    }
  } catch (err) {
    console.error("Error getting active YouTube channel:", err);
    return { error: "Failed to get active YouTube channel" };
  }
};

export const getUserPrivateOnboardingData = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  try {
    const user = await client.users.getUser(userId);
    return {
      applicationName:
        (user.privateMetadata?.applicationName as string) || null,
      applicationType:
        (user.privateMetadata?.applicationType as string) || null,
      activeYouTubeChannelId:
        (user.privateMetadata?.activeYouTubeChannelId as string) || null,
    };
  } catch (err) {
    console.error("Error getting user private onboarding data:", err);
    return null;
  }
};

export const getActiveYouTubeChannelId = async (): Promise<string | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  try {
    const user = await client.users.getUser(userId);
    return (user.privateMetadata?.activeYouTubeChannelId as string) || null;
  } catch (err) {
    console.error("Error getting active YouTube channel:", err);
    return null;
  }
};

export const getActiveYouTubeChannelInfo = async () => {
  const activeChannelId = await getActiveYouTubeChannelId();
  if (!activeChannelId) {
    return { error: "No active YouTube channel set" };
  }

  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    return { error: "No access token available" };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${activeChannelId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return { error: `YouTube API error: ${response.status}` };
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return { error: "Active YouTube channel not found" };
    }

    const channel = data.items[0];
    const channelInfo = {
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
    };

    return { success: true, channel: channelInfo };
  } catch (error) {
    console.error("Error fetching active channel info:", error);
    return { error: "Failed to fetch active channel information" };
  }
};

const getGoogleAccessToken = async () => {
  const user = await currentUser();
  if (!user) return null;
  const client = await clerkClient();
  const tokens = (await client.users.getUserOauthAccessToken(user.id, "google"))
    .data;

  // You'll get an array, use tokens[0].token
  return Array.isArray(tokens) && tokens.length > 0 && tokens[0]?.token
    ? tokens[0].token
    : null;
};

export const getAllYoutubeChannels = async () => {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken) return null;

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
      return { error: `YouTube API error: ${response.status}` };
    }

    const data = await response.json();

    // If user has no YouTube channels, return appropriate message
    if (!data.items || data.items.length === 0) {
      return { error: "No YouTube channels found for this user" };
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
    return { error: "Failed to fetch YouTube channel information" };
  }
};

// Keep the old function for backward compatibility but mark as deprecated
export const getYoutubeInfo = async () => {
  console.warn(
    "getYoutubeInfo is deprecated, use getAllYoutubeChannels instead",
  );
  const result = await getAllYoutubeChannels();
  if (result?.success && result.channels) {
    // Return the first channel for backward compatibility
    return { success: true, channel: result.channels[0] };
  }
  return result;
};

export const getRecentVideos = async (
  channelId?: string,
  maxResults: number = 10,
) => {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken) return null;

  try {
    let uploadsPlaylistId: string;

    if (channelId) {
      // Get specific channel info
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!channelResponse.ok) {
        return { error: "Failed to get channel information" };
      }

      const channelData = await channelResponse.json();
      if (!channelData.items || channelData.items.length === 0) {
        return { error: "YouTube channel not found" };
      }

      uploadsPlaylistId =
        channelData.items[0].contentDetails.relatedPlaylists.uploads;
    } else {
      // Get the user's default channel (first one from their account)
      const channelResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!channelResponse.ok) {
        return { error: "Failed to get channel information" };
      }

      const channelData = await channelResponse.json();
      if (!channelData.items || channelData.items.length === 0) {
        return { error: "No YouTube channel found" };
      }

      uploadsPlaylistId =
        channelData.items[0].contentDetails.relatedPlaylists.uploads;
    }

    // Get recent videos from the uploads playlist
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!videosResponse.ok) {
      return { error: "Failed to get recent videos" };
    }

    const videosData = await videosResponse.json();

    const videos =
      videosData.items?.map((item: any) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
      })) || [];

    return { success: true, videos };
  } catch (error) {
    console.error("Error fetching recent videos:", error);
    return { error: "Failed to fetch recent videos" };
  }
};

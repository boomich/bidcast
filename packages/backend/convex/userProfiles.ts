import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get user profile
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Mutation to create or update user profile
export const upsertUserProfile = mutation({
  args: {
    userId: v.string(),
    applicationName: v.optional(v.string()),
    applicationType: v.optional(v.string()),
    activeYouTubeChannelId: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        ...(args.applicationName !== undefined && { applicationName: args.applicationName }),
        ...(args.applicationType !== undefined && { applicationType: args.applicationType }),
        ...(args.activeYouTubeChannelId !== undefined && { activeYouTubeChannelId: args.activeYouTubeChannelId }),
        ...(args.onboardingComplete !== undefined && { onboardingComplete: args.onboardingComplete }),
        updatedAt: now,
      });
    } else {
      return await ctx.db.insert("userProfiles", {
        userId: args.userId,
        applicationName: args.applicationName,
        applicationType: args.applicationType,
        activeYouTubeChannelId: args.activeYouTubeChannelId,
        onboardingComplete: args.onboardingComplete ?? false,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Query to get all YouTube channels for a user
export const getUserYouTubeChannels = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("youtubeChannels")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Query to get active YouTube channel for a user
export const getActiveYouTubeChannel = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("youtubeChannels")
      .withIndex("by_userId_and_active", (q) => q.eq("userId", args.userId).eq("isActive", true))
      .first();
  },
});

// Mutation to save multiple YouTube channels
export const saveYouTubeChannels = mutation({
  args: {
    userId: v.string(),
    channels: v.array(v.object({
      channelId: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      customUrl: v.optional(v.string()),
      publishedAt: v.string(),
      thumbnails: v.any(),
      country: v.optional(v.string()),
      defaultLanguage: v.optional(v.string()),
      statistics: v.object({
        viewCount: v.number(),
        subscriberCount: v.number(),
        videoCount: v.number(),
      }),
      branding: v.object({
        bannerImageUrl: v.optional(v.string()),
        keywords: v.optional(v.string()),
      }),
      uploadsPlaylistId: v.string(),
      isActive: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // First, get existing channels to avoid duplicates
    const existingChannels = await ctx.db
      .query("youtubeChannels")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const existingChannelIds = new Set(existingChannels.map(c => c.channelId));

    // Insert or update channels
    const results = [];
    for (const channel of args.channels) {
      const existing = existingChannels.find(c => c.channelId === channel.channelId);
      
      if (existing) {
        // Update existing channel
        const result = await ctx.db.patch(existing._id, {
          title: channel.title,
          description: channel.description,
          customUrl: channel.customUrl,
          publishedAt: channel.publishedAt,
          thumbnails: channel.thumbnails,
          country: channel.country,
          defaultLanguage: channel.defaultLanguage,
          statistics: channel.statistics,
          branding: channel.branding,
          uploadsPlaylistId: channel.uploadsPlaylistId,
          isActive: channel.isActive,
          updatedAt: now,
        });
        results.push(result);
      } else {
        // Insert new channel
        const result = await ctx.db.insert("youtubeChannels", {
          userId: args.userId,
          channelId: channel.channelId,
          title: channel.title,
          description: channel.description,
          customUrl: channel.customUrl,
          publishedAt: channel.publishedAt,
          thumbnails: channel.thumbnails,
          country: channel.country,
          defaultLanguage: channel.defaultLanguage,
          statistics: channel.statistics,
          branding: channel.branding,
          uploadsPlaylistId: channel.uploadsPlaylistId,
          isActive: channel.isActive,
          createdAt: now,
          updatedAt: now,
        });
        results.push(result);
      }
    }

    return results;
  },
});

// Mutation to set active YouTube channel
export const setActiveYouTubeChannel = mutation({
  args: {
    userId: v.string(),
    channelId: v.string(),
  },
  handler: async (ctx, args) => {
    // First, set all channels to inactive
    const allChannels = await ctx.db
      .query("youtubeChannels")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    for (const channel of allChannels) {
      await ctx.db.patch(channel._id, {
        isActive: false,
        updatedAt: Date.now(),
      });
    }

    // Set the selected channel as active
    const targetChannel = await ctx.db
      .query("youtubeChannels")
      .withIndex("by_userId_and_channelId", (q) => 
        q.eq("userId", args.userId).eq("channelId", args.channelId)
      )
      .first();

    if (targetChannel) {
      await ctx.db.patch(targetChannel._id, {
        isActive: true,
        updatedAt: Date.now(),
      });

      // Update user profile with active channel
      await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first()
        .then(async (profile) => {
          if (profile) {
            await ctx.db.patch(profile._id, {
              activeYouTubeChannelId: args.channelId,
              updatedAt: Date.now(),
            });
          }
        });

      return { success: true, activeChannelId: args.channelId };
    }

    return { success: false, error: "Channel not found" };
  },
});
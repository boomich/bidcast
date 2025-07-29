import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createChannel = mutation({
  args: {
    clerkUserId: v.string(),
    clerkExternalAccountId: v.string(),
    channelId: v.string(),
    channelTitle: v.string(),
    channelUrl: v.string(),
    channelThumbnail: v.string(),
  },
  handler: async (
    ctx,
    {
      clerkUserId,
      clerkExternalAccountId,
      channelId,
      channelTitle,
      channelUrl,
      channelThumbnail,
    },
  ) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to mutation");

    const user = await ctx.db
      .query("Users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) throw new Error("No user found! Please run onboarding first.");

    const existingChannel = await ctx.db
      .query("UserYoutubeChannels")
      .withIndex("by_channel_id", (q) => q.eq("channelId", channelId))
      .first();

    if (existingChannel !== null) return existingChannel;

    const ytChannelId = await ctx.db.insert("UserYoutubeChannels", {
      clerkUserId,
      clerkExternalAccountId,
      channelId,
      channelTitle,
      channelUrl,
      channelThumbnail,
    });
    return ytChannelId;
  },
});

export const getChannels = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to mutation");

    const clerkUserId = identity.subject;

    const channels = await ctx.db
      .query("UserYoutubeChannels")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .collect();

    return channels;
  },
});

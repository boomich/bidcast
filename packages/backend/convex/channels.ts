import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createChannel = mutation({
  args: {
    bio: v.string(),
    url: v.string(),
    title: v.string(),
    channelId: v.string(),
    thumbnail: v.string(),
    coverImage: v.string(),
    creatorId: v.id("creators"),
  },
  handler: async (
    ctx,
    { bio, url, title, channelId, thumbnail, coverImage, creatorId },
  ) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to mutation");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error("No user found! Please run onboarding first.");

    const existingChannel = await ctx.db
      .query("channels")
      .withIndex("by_channel_id", (q) => q.eq("channelId", channelId))
      .first();

    if (existingChannel !== null) return existingChannel;

    const creator = await ctx.db
      .query("creators")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();

    if (!creator)
      throw new Error("No creator found! Please run onboarding first.");

    const ytChannelId = await ctx.db.insert("channels", {
      bio,
      url,
      title,
      channelId,
      thumbnail,
      coverImage,
      creatorId,
    });

    await ctx.db.patch(creator._id, {
      channels: [...(creator.channels ?? []), ytChannelId],
    });

    return ytChannelId;
  },
});

export const getChannels = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to mutation");

    const channels = await ctx.db.query("channels").fullTableScan();
    return channels;
  },
});

import { v } from "convex/values";
import { Auth } from "convex/server";

import { mutation } from "./_generated/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const createChannel = mutation({
  args: {
    youtubeChannelId: v.string(),
    channelName: v.string(),
    channelUrl: v.string(),
  },
  handler: async (ctx, { youtubeChannelId, channelName, channelUrl }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }
    const channelId = await ctx.db.insert("youtubeChannels", {
      user: user._id,
      youtubeChannelId,
      channelName,
      channelUrl,
    });
    return channelId;
  },
});

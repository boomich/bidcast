import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  Users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  UserYoutubeChannels: defineTable({
    clerkUserId: v.string(),
    clerkExternalAccountId: v.string(),
    channelId: v.string(),

    channelTitle: v.string(),
    channelUrl: v.string(),
    channelThumbnail: v.string(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_channel_id", ["channelId"]),
});

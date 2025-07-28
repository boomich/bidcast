import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),

  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  youtubeChannels: defineTable({
    user: v.id("users"),
    channelName: v.string(),
    channelUrl: v.string(),
    youtubeChannelId: v.string(),
  }),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  
  userProfiles: defineTable({
    userId: v.string(), // Clerk user ID
    applicationName: v.optional(v.string()),
    applicationType: v.optional(v.string()),
    activeYouTubeChannelId: v.optional(v.string()),
    onboardingComplete: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  youtubeChannels: defineTable({
    userId: v.string(), // Clerk user ID
    channelId: v.string(), // YouTube channel ID
    title: v.string(),
    description: v.optional(v.string()),
    customUrl: v.optional(v.string()),
    publishedAt: v.string(),
    thumbnails: v.any(), // Store thumbnail URLs object
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
    isActive: v.boolean(), // Whether this is the currently active channel
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_channelId", ["channelId"])
    .index("by_userId_and_channelId", ["userId", "channelId"])
    .index("by_userId_and_active", ["userId", "isActive"]),
});

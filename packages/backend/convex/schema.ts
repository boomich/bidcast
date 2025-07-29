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

  // Crowdfunding tables for Bidcast funding engine
  Campaigns: defineTable({
    creatorId: v.id("Users"),
    title: v.string(),
    description: v.string(),
    goalAmount: v.number(),
    deadline: v.number(), // Unix epoch millis
    fundedAmount: v.number(),
    status: v.string(), // "open" | "succeeded" | "failed"
  }).index("by_creator", ["creatorId"]),

  Pledges: defineTable({
    userId: v.id("Users"),
    campaignId: v.id("Campaigns"),
    amount: v.number(),
    createdAt: v.number(),
    refunded: v.optional(v.boolean()),
    eligibleForPerks: v.optional(v.boolean()),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_user_campaign", ["userId", "campaignId"]),

  UserCredits: defineTable({
    userId: v.id("Users"),
    balance: v.number(),
  }).index("by_userId", ["userId"]),
});

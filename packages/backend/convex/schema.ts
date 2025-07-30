import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    tokenIdentifier: v.string(),
    onboarded: v.optional(v.boolean()),
    roles: v.array(
      v.union(v.literal("fan"), v.literal("creator"), v.literal("owner")),
    ),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_user_id", ["clerkId"]),

  fans: defineTable({
    userId: v.id("users"),
    favoriteChannels: v.optional(v.array(v.id("channels"))),
  }).index("by_user_id", ["userId"]),

  creators: defineTable({
    userId: v.id("users"),
    channels: v.optional(v.array(v.id("channels"))),
  }).index("by_user_id", ["userId"]),

  channels: defineTable({
    bio: v.string(),
    url: v.string(),
    title: v.string(),
    channelId: v.string(),
    thumbnail: v.string(),
    coverImage: v.string(),
    creatorId: v.id("creators"),
  })
    .index("by_creator_id", ["creatorId"])
    .index("by_channel_id", ["channelId"]),

  campaigns: defineTable({
    title: v.string(),
    deadline: v.number(), // Unix epoch millis
    goalAmount: v.number(),
    description: v.string(),
    fundedAmount: v.number(),
    creatorId: v.id("creators"),
    channelId: v.id("channels"),
    status: v.union(
      v.literal("open"),
      v.literal("succeeded"),
      v.literal("failed"),
    ),
  })
    .index("by_creator_id", ["creatorId"])
    .index("by_channel_id", ["channelId"]),

  bids: defineTable({
    amount: v.number(),
    userId: v.id("users"),
    campaignId: v.id("campaigns"),
    refunded: v.optional(v.boolean()),
    recredited: v.optional(v.boolean()),
  })
    .index("by_campaign_id", ["campaignId"])
    .index("by_user_id", ["userId"]),

  wallet: defineTable({
    balance: v.number(),
    userId: v.id("users"),
  }).index("by_user_id", ["userId"]),
});

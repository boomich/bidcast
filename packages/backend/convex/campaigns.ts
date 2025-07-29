import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Query: list campaigns with basic optional filters
export const listCampaigns = query({
  args: {
    status: v.optional(v.string()), // "open" | "succeeded" | "failed" etc.
    search: v.optional(v.string()),
  },
  handler: async (ctx, { status, search }) => {
    let q = ctx.db.query("Campaigns");
    if (status) q = q.filter((c) => c.eq("status", status));

    const campaigns = await q.collect();

    if (search) {
      const lower = search.toLowerCase();
      return campaigns.filter((c) =>
        c.title.toLowerCase().includes(lower) ||
        c.description.toLowerCase().includes(lower),
      );
    }
    return campaigns;
  },
});

// Mutation: create a new campaign
export const createCampaign = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    goalAmount: v.number(),
    deadline: v.number(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("Users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("No user");

    const campaignId = await ctx.db.insert("Campaigns", {
      creatorId: user._id as Id<"Users">,
      title: args.title,
      description: args.description,
      goalAmount: args.goalAmount,
      deadline: args.deadline,
      fundedAmount: 0,
      status: "open",
      image: args.image ?? "",
    } as any);

    return campaignId;
  },
});

// Mutation: update campaign (only creator or admin)
export const updateCampaign = mutation({
  args: {
    campaignId: v.id("Campaigns"),
    updates: v.any(),
  },
  handler: async (ctx, { campaignId, updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new Error("Not found");

    // TODO: enforce permissions (creator or admin). Skipped for now.

    await ctx.db.patch(campaignId, { ...updates, updatedAt: Date.now() });
    return true;
  },
});

// Query: get single campaign by id
export const getCampaign = query({
  args: {
    campaignId: v.id("Campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    return await ctx.db.get(campaignId);
  },
});
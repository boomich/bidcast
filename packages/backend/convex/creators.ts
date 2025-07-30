import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createCreator = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const existingCreator = await ctx.db
      .query("creators")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (existingCreator) return existingCreator;

    const creatorId = await ctx.db.insert("creators", { userId });

    // Return the full creator object instead of just the ID
    const newCreator = await ctx.db.get(creatorId);
    return newCreator;
  },
});

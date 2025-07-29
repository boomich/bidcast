import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createProfile = mutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    // If profile exists, return its ID
    if (existingProfile) {
      return existingProfile._id;
    }

    // Otherwise, create a new profile
    const profileId = await ctx.db.insert("profiles", {
      clerkUserId,
    });
    return profileId;
  },
});

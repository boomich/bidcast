import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    role: v.union(v.literal("fan"), v.literal("creator"), v.literal("owner")),
  },
  handler: async (ctx, { role }) => {
    // Get the current user's identity from Clerk via Convex auth helper.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to mutation");

    // Check if we've already stored this identity before.
    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    // If it's a new identity, create a new `User`.
    const newUserId = await ctx.db.insert("users", {
      clerkId: identity.subject as string,
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
      onboarded: false,
      roles: [role as "fan" | "creator" | "owner"],
    });

    return newUserId;
  },
});

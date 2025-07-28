import { Auth } from "convex/server";
import { mutation } from "./_generated/server";

export const getUserId = async (ctx: { auth: Auth; db: any }) => {
  const identity = await ctx.auth.getUserIdentity();
  console.log("HERE identity", identity);
  if (!identity) {
    throw new Error("Unauthenticated call to mutation");
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();
  return user?._id;
};

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Get the current user's identity from Clerk via Convex auth helper.
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

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
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
    });

    return newUserId;
  },
});

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
    const userId = await getUserId(ctx);

    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
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
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

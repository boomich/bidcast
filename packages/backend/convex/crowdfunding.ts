import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/*
 * Crowdfunding backend logic for Bidcast.
 *
 * Tables referenced:
 *  - Users
 *  - Campaigns
 *  - Pledges
 *  - UserCredits
 *
 * This file contains:
 *  - canUserPledge: query to determine if a user can pledge to a campaign
 *  - createPledge: mutation to create a pledge with partial credit usage
 *  - finalizeCampaign: mutation to mark campaign as succeeded/failed and settle funds
 *  - requestRefund: mutation allowing backers to withdraw store credit as a refund
 */

// Query: canUserPledge -------------------------------------------------------
export const canUserPledge = query({
  args: {
    campaignId: v.id("Campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) return false;
    return campaign.status === "open";
  },
});

// Mutation: createPledge -----------------------------------------------------
export const createPledge = mutation({
  args: {
    campaignId: v.id("Campaigns"),
    amount: v.number(),
  },
  handler: async (ctx, { campaignId, amount }) => {
    if (amount <= 0) throw new Error("Pledge amount must be positive");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to mutation");

    // Retrieve current user document.
    const user = await ctx.db
      .query("Users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found – onboarding incomplete.");

    // Retrieve campaign.
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status !== "open") throw new Error("Campaign is not open for pledges");

    // Multiple pledges per user allowed – no duplication check.

    // Determine available store credit.
    let creditDoc = await ctx.db
      .query("UserCredits")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    let creditBalance = creditDoc?.balance ?? 0;
    const creditUsed = Math.min(creditBalance, amount);
    const cashAmount = amount - creditUsed; // Simulated external charge

    // Deduct used credit.
    if (creditUsed > 0) {
      if (!creditDoc) {
        // This should not happen because creditBalance would be 0, but guard anyway.
        throw new Error("Inconsistent credit state");
      }
      await ctx.db.patch(creditDoc._id, { balance: creditBalance - creditUsed });
    }

    // Simulate external payment for cashAmount.
    if (cashAmount > 0) {
      // In real integration, we'd call a payment API (Stripe, etc.).
      // For now we simply assume payment succeeds.
    }

    // Insert pledge (multiple pledges per user supported).
    const pledgeId = await ctx.db.insert("Pledges", {
      userId: user._id as Id<"Users">,
      campaignId,
      amount,
      createdAt: Date.now(),
      refunded: false,
      eligibleForPerks: false,
    });

    // Recalculate total funded amount to avoid race conditions.
    const pledgesForCampaign = await ctx.db
      .query("Pledges")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    const totalFunded = pledgesForCampaign.reduce((sum, p) => sum + p.amount, 0);

    await ctx.db.patch(campaignId, {
      fundedAmount: totalFunded,
    });

    return {
      pledgeId,
      creditUsed,
      cashAmount,
    };
  },
});

// Mutation: finalizeCampaign -------------------------------------------------
export const finalizeCampaign = mutation({
  args: {
    campaignId: v.id("Campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status !== "open") {
      return campaign.status; // Already finalized.
    }

    const now = Date.now();
    if (now < campaign.deadline) {
      throw new Error("Cannot finalize before campaign deadline");
    }

    // Recompute funded total from pledges to ensure accuracy.
    const pledges = await ctx.db
      .query("Pledges")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
      .collect();

    const fundedTotal = pledges.reduce((sum, p) => sum + p.amount, 0);

    const succeeded = fundedTotal >= campaign.goalAmount;

    if (succeeded) {
      await ctx.db.patch(campaignId, { status: "succeeded", fundedAmount: fundedTotal });

      // Credit creator with total funds (simulated).
      const creatorId = campaign.creatorId as Id<"Users">;
      let creatorCredit = await ctx.db
        .query("UserCredits")
        .withIndex("by_userId", (q) => q.eq("userId", creatorId))
        .unique();
      if (creatorCredit) {
        await ctx.db.patch(creatorCredit._id, {
          balance: creatorCredit.balance + campaign.fundedAmount,
        });
      } else {
        await ctx.db.insert("UserCredits", {
          userId: creatorId,
          balance: campaign.fundedAmount,
        });
      }

      // Mark pledges as eligible for perks.
      for (const pledge of pledges) {
        await ctx.db.patch(pledge._id, { eligibleForPerks: true });
      }
      return "succeeded";
    }

    // Otherwise failed -------------------------------------------------------
    await ctx.db.patch(campaignId, { status: "failed", fundedAmount: fundedTotal });

    // Refund all pledges as store credit.
    for (const pledge of pledges) {
      const backerId = pledge.userId as Id<"Users">;

      let credit = await ctx.db
        .query("UserCredits")
        .withIndex("by_userId", (q) => q.eq("userId", backerId))
        .unique();
      if (credit) {
        await ctx.db.patch(credit._id, {
          balance: credit.balance + pledge.amount,
        });
      } else {
        await ctx.db.insert("UserCredits", {
          userId: backerId,
          balance: pledge.amount,
        });
      }

      await ctx.db.patch(pledge._id, { refunded: true });
    }

    return "failed";
  },
});

// Mutation: requestRefund ----------------------------------------------------
export const requestRefund = mutation({
  args: {
    campaignId: v.id("Campaigns"),
  },
  handler: async (ctx, { campaignId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to mutation");

    const user = await ctx.db
      .query("Users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status !== "failed") throw new Error("Refunds allowed only on failed campaigns");

    // Collect all pledges for this campaign & user.
    const pledges = await ctx.db
      .query("Pledges")
      .withIndex("by_user_campaign", (q) =>
        q.eq("userId", user._id).eq("campaignId", campaignId),
      )
      .collect();

    if (pledges.length === 0) throw new Error("No pledges from user to refund");

    const refundable = pledges.reduce((sum, p) => sum + (p.refunded ? p.amount : 0), 0);
    if (refundable === 0) throw new Error("Pledges not yet converted to store credit");

    // Withdraw store credit (simulate external payout)
    let credit = await ctx.db
      .query("UserCredits")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!credit || credit.balance < refundable) {
      throw new Error("Insufficient store credit for refund");
    }

    await ctx.db.patch(credit._id, { balance: credit.balance - refundable });

    // In real scenario, initiate bulk refund through payment processor.

    return "refund_requested";
  },
});
import { Campaign, CampaignFilters } from "@/types/campaign";
import { api } from "@packages/backend/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";

// NOTE: This service now proxies calls to Convex backend instead of mock data.

export class CampaignService {
  static async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    const campaigns = await fetchQuery(api.campaigns.listCampaigns, {
      status: undefined, // Map filters to status if provided
      search: filters?.searchQuery,
    });

    // Convert to UI model
    const mapped: Campaign[] = (campaigns as any).map((c: any) => this.backendToUi(c));

    // TODO: adapt filters logic (category, status etc.) on backend side. For now filter client-side.
    let list = mapped;
    if (filters) {
      list = this.filterCampaigns(list as any, filters);
    }
    return list as any;
  }

  static async getCampaignById(id: string): Promise<Campaign | null> {
    const raw = await fetchQuery(api.campaigns.getCampaign, { campaignId: id as any }) as any;
    if (!raw) return null;
    return this.backendToUi(raw);
  }

  static async createCampaign(campaignData: {
    title: string;
    description: string;
    goalAmount: number;
    deadline: number;
    image?: string;
  }): Promise<Campaign> {
    const id = await fetchMutation(api.campaigns.createCampaign, campaignData);
    const campaign = await this.getCampaignById(id as unknown as string);
    return campaign as any;
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>) {
    await fetchMutation(api.campaigns.updateCampaign, {
      campaignId: id as any,
      updates,
    });
    return this.getCampaignById(id);
  }

  // Placeholder until backend stats API is added.
  static async getCampaignStats() {
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalFunding: 0,
      averageFunding: 0,
    };
  }

  private static filterCampaigns(campaigns: Campaign[], filters: CampaignFilters): Campaign[] {
    return campaigns.filter((campaign) => {
      // Search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch =
          campaign.title.toLowerCase().includes(searchLower) ||
          campaign.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter (not yet stored on backend)
      if (filters.selectedCategory && filters.selectedCategory !== "All") {
        // TODO: category property on backend campaign
      }

      // Status filter
      if (filters.status && campaign.status !== filters.status) {
        return false;
      }

      return true;
    });
  }

  private static backendToUi(c: any): Campaign {
    const now = Date.now();
    const daysLeft = Math.max(0, Math.ceil((c.deadline - now) / (1000 * 60 * 60 * 24)));
    // TODO: backend store category
    return {
      id: c._id,
      title: c.title,
      creator: c.creatorName ?? "Creator", // placeholder until join
      description: c.description,
      image: c.image ?? "https://source.unsplash.com/random/800x600?sig=" + Math.random(),
      fundingGoal: c.goalAmount,
      currentFunding: c.fundedAmount,
      backers: 0, // we will compute separately later
      daysLeft,
      category: "Other",
      status: c.status === "succeeded" ? "funded" : c.status === "failed" ? "expired" : "active",
      createdAt: new Date(c.createdAt ?? c._creationTime ?? 0),
      updatedAt: new Date(c.updatedAt ?? c._lastModified ?? c._creationTime ?? 0),
    } as Campaign;
  }
}
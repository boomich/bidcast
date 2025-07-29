"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Campaign, CampaignFilters } from "@/types/campaign";
import { CampaignService } from "@/lib/services/campaign-service";

interface UseCampaignsOptions {
  initialFilters?: CampaignFilters;
  autoFetch?: boolean;
}

interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  filters: CampaignFilters;
  setFilters: (filters: CampaignFilters) => void;
  refetch: () => Promise<void>;
  createCampaign: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Campaign>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<Campaign | null>;
}

export function useCampaigns(options: UseCampaignsOptions = {}): UseCampaignsReturn {
  const { initialFilters = { searchQuery: "", selectedCategory: "All" }, autoFetch = true } = options;
  
  const [filters, setFilters] = useState<CampaignFilters>(initialFilters);

  // Fetch campaigns directly from Convex with live reactivity
  const campaignsData = useQuery(api.campaigns.listCampaigns, {
    status: undefined,
    search: filters.searchQuery || undefined,
  });

  const createCampaignMutation = useMutation(api.campaigns.createCampaign);
  const updateCampaignMutation = useMutation(api.campaigns.updateCampaign);

  const loading = campaignsData === undefined;
  const campaigns = (campaignsData as any as Campaign[]) || [];

  // Local async refetch placeholder (Convex auto updates)
  const refetch = useCallback(async () => {}, []);

  const createCampaign = useCallback(async (campaignData: {
    title: string;
    description: string;
    goalAmount: number;
    deadline: number;
    image?: string;
  }) => {
    const id = await createCampaignMutation(campaignData as any);
    return id;
  }, [createCampaignMutation]);

  const updateCampaign = useCallback(async (id: string, updates: Partial<Campaign>) => {
    await updateCampaignMutation({ campaignId: id as any, updates });
  }, [updateCampaignMutation]);

  return {
    campaigns,
    loading,
    error: null,
    filters,
    setFilters,
    refetch,
    createCampaign,
    updateCampaign,
  };
}
"use client";

import { useState, useEffect, useCallback } from "react";
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
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>(initialFilters);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CampaignService.getCampaigns(filters);
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refetch = useCallback(async () => {
    await fetchCampaigns();
  }, [fetchCampaigns]);

  const createCampaign = useCallback(async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCampaign = await CampaignService.createCampaign(campaignData);
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create campaign");
    }
  }, []);

  const updateCampaign = useCallback(async (id: string, updates: Partial<Campaign>) => {
    try {
      const updatedCampaign = await CampaignService.updateCampaign(id, updates);
      if (updatedCampaign) {
        setCampaigns(prev => 
          prev.map(campaign => 
            campaign.id === id ? updatedCampaign : campaign
          )
        );
      }
      return updatedCampaign;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update campaign");
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCampaigns();
    }
  }, [fetchCampaigns, autoFetch]);

  return {
    campaigns,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    createCampaign,
    updateCampaign,
  };
}
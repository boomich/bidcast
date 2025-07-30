"use client";

import { Plus } from "lucide-react";
import { useQuery } from "convex/react";

import Image from "next/image";

import { useCampaigns } from "@/hooks";
import { Button, Card } from "@/components/ui";
import { CampaignFilters } from "@/types";
import { Navigation } from "@/components/layout";
import { api } from "@packages/backend/convex/_generated/api";
import { PageHeader, SearchFilters, CampaignCard } from "@/components/ui";
import { SimpleFooterWithFourGrids } from "@/components/blocks/footers/simple-footer-with-four-grids";

export default function FeedPage() {
  const { campaigns, loading, error, filters, setFilters } = useCampaigns();

  // Get other channels from database
  const channels = useQuery(api.channels.getChannels);

  const handleCreateCampaign = () => {
    // TODO: Implement campaign creation flow
    console.log("Create campaign clicked");
  };

  const handleBackCampaign = (campaignId: string) => {
    // TODO: Implement campaign backing flow
    console.log("Back campaign clicked:", campaignId);
  };

  const handleFiltersChange = (newFilters: CampaignFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Error Loading Campaigns
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHeader
        title="Campaign Feed"
        subtitle="Discover and back amazing projects"
        action={{
          label: "Create Campaign",
          onClick: handleCreateCampaign,
          icon: Plus,
        }}
        // sticky
      />

      <div className="container mx-auto px-4 py-6">
        {channels?.map((channel) => (
          <div
            key={channel.channelId}
            className="inline-flex cursor-pointer mb-4 p-4 flex-row items-center justify-center gap-4"
          >
            <Image
              src={channel.thumbnail}
              alt={channel.title}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <p className="text-secondary font-medium">{channel.title}</p>
              <p className="text-secondary font-satoshi">{channel.url}</p>
            </div>
          </div>
        ))}

        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          className="mb-8"
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading campaigns..."
              : `Showing ${campaigns.length} campaigns`}
            {filters.selectedCategory !== "All" &&
              ` in ${filters.selectedCategory}`}
            {filters.searchQuery && ` matching "${filters.searchQuery}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted aspect-video rounded-t-lg" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-2 bg-muted rounded w-full" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campaign Grid */}
        {!loading && campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onBackCampaign={handleBackCampaign}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && campaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.searchQuery || filters.selectedCategory !== "All"
                  ? "Try adjusting your search criteria or filters."
                  : "Be the first to create a campaign!"}
              </p>
              <div className="flex gap-2 justify-center">
                {(filters.searchQuery ||
                  filters.selectedCategory !== "All") && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleFiltersChange({
                        searchQuery: "",
                        selectedCategory: "All",
                      })
                    }
                  >
                    Clear filters
                  </Button>
                )}
                <Button onClick={handleCreateCampaign}>Create Campaign</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SimpleFooterWithFourGrids />
    </div>
  );
}

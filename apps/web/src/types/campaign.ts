export interface Campaign {
  id: string;
  title: string;
  creator: string;
  description: string;
  image: string;
  fundingGoal: number;
  currentFunding: number;
  backers: number;
  daysLeft: number;
  category: CampaignCategory;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignCategory = 
  | "Fashion"
  | "Technology" 
  | "Food & Beverage"
  | "Lifestyle"
  | "Education"
  | "Art"
  | "Music"
  | "Film"
  | "Gaming"
  | "Health"
  | "Environment"
  | "Other";

export type CampaignStatus = "active" | "funded" | "expired" | "draft";

export interface CampaignFilters {
  searchQuery: string;
  selectedCategory: CampaignCategory | "All";
  minFunding?: number;
  maxFunding?: number;
  status?: CampaignStatus;
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalFunding: number;
  averageFunding: number;
}
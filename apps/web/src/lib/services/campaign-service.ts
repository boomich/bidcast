import { Campaign, CampaignFilters, CampaignCategory } from "@/types/campaign";

// Mock data - in a real app, this would come from an API
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Summer Fashion Collection",
    creator: "Sarah Chen",
    description: "Sustainable fashion pieces for the modern wardrobe",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 156,
    daysLeft: 12,
    category: "Fashion",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "Smart Home Automation Kit",
    creator: "TechFlow Labs",
    description: "Revolutionary IoT devices for seamless home control",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
    fundingGoal: 75000,
    currentFunding: 58200,
    backers: 243,
    daysLeft: 8,
    category: "Technology",
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    title: "Artisan Coffee Roastery",
    creator: "Mountain Peak Coffee",
    description: "Direct trade coffee beans from sustainable farms",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop",
    fundingGoal: 25000,
    currentFunding: 18750,
    backers: 89,
    daysLeft: 20,
    category: "Food & Beverage",
    status: "active",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    title: "Urban Vertical Garden System",
    creator: "GreenSpace Innovations",
    description: "Modular vertical gardens for apartment living",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    fundingGoal: 40000,
    currentFunding: 35600,
    backers: 412,
    daysLeft: 5,
    category: "Lifestyle",
    status: "active",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "5",
    title: "AI-Powered Learning Platform",
    creator: "EduTech Solutions",
    description: "Personalized education through adaptive AI technology",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    fundingGoal: 100000,
    currentFunding: 72400,
    backers: 328,
    daysLeft: 15,
    category: "Education",
    status: "active",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "6",
    title: "Eco-Friendly Packaging Solutions",
    creator: "Pure Pack",
    description: "Biodegradable packaging alternatives for businesses",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
    fundingGoal: 60000,
    currentFunding: 60000,
    backers: 245,
    daysLeft: 0,
    category: "Environment",
    status: "funded",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
  },
];

export class CampaignService {
  static async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredCampaigns = [...mockCampaigns];
    
    if (filters) {
      filteredCampaigns = this.filterCampaigns(filteredCampaigns, filters);
    }
    
    return filteredCampaigns;
  }

  static async getCampaignById(id: string): Promise<Campaign | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCampaigns.find(campaign => campaign.id === id) || null;
  }

  static async getCampaignStats(): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalFunding: number;
    averageFunding: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const activeCampaigns = mockCampaigns.filter(c => c.status === "active");
    const totalFunding = mockCampaigns.reduce((sum, c) => sum + c.currentFunding, 0);
    
    return {
      totalCampaigns: mockCampaigns.length,
      activeCampaigns: activeCampaigns.length,
      totalFunding,
      averageFunding: totalFunding / mockCampaigns.length,
    };
  }

  private static filterCampaigns(campaigns: Campaign[], filters: CampaignFilters): Campaign[] {
    return campaigns.filter((campaign) => {
      // Search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch =
          campaign.title.toLowerCase().includes(searchLower) ||
          campaign.creator.toLowerCase().includes(searchLower) ||
          campaign.description.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.selectedCategory && filters.selectedCategory !== "All") {
        if (campaign.category !== filters.selectedCategory) return false;
      }

      // Funding range filters
      if (filters.minFunding !== undefined && campaign.fundingGoal < filters.minFunding) {
        return false;
      }
      
      if (filters.maxFunding !== undefined && campaign.fundingGoal > filters.maxFunding) {
        return false;
      }

      // Status filter
      if (filters.status && campaign.status !== filters.status) {
        return false;
      }

      return true;
    });
  }

  static async createCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCampaign: Campaign = {
      ...campaignData,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // In a real app, this would be saved to the database
    mockCampaigns.push(newCampaign);
    
    return newCampaign;
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) return null;
    
    const existingCampaign = mockCampaigns[campaignIndex];
    const updatedCampaign: Campaign = {
      ...existingCampaign,
      ...updates,
      updatedAt: new Date(),
    };
    
    mockCampaigns[campaignIndex] = updatedCampaign;
    
    return updatedCampaign;
  }
}
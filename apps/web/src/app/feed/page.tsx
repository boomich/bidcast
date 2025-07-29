"use client";

import React, { useState, useMemo } from "react";

import { Search, Plus, Users, Target } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Navbar from "@/components/blocks/bc-navbar";

interface Campaign {
  id: string;
  title: string;
  creator: string;
  description: string;
  image: string;
  fundingGoal: number;
  currentFunding: number;
  backers: number;
  daysLeft: number;
  category: string;
}

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Summer Fashion Collection",
    creator: "Sarah Chen",
    description: "Sustainable fashion pieces for the modern wardrobe",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 156,
    daysLeft: 12,
    category: "Fashion",
  },
  {
    id: "2",
    title: "Smart Home Automation Kit",
    creator: "TechFlow Labs",
    description: "Revolutionary IoT devices for seamless home control",
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
    fundingGoal: 75000,
    currentFunding: 58200,
    backers: 243,
    daysLeft: 8,
    category: "Technology",
  },
  {
    id: "3",
    title: "Artisan Coffee Roastery",
    creator: "Mountain Peak Coffee",
    description: "Direct trade coffee beans from sustainable farms",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop",
    fundingGoal: 25000,
    currentFunding: 18750,
    backers: 89,
    daysLeft: 20,
    category: "Food & Beverage",
  },
  {
    id: "4",
    title: "Urban Vertical Garden System",
    creator: "GreenSpace Innovations",
    description: "Modular vertical gardens for apartment living",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    fundingGoal: 40000,
    currentFunding: 35600,
    backers: 412,
    daysLeft: 5,
    category: "Lifestyle",
  },
  {
    id: "5",
    title: "AI-Powered Learning Platform",
    creator: "EduTech Solutions",
    description: "Personalized education through adaptive AI technology",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    fundingGoal: 100000,
    currentFunding: 72400,
    backers: 328,
    daysLeft: 15,
    category: "Education",
  },
  {
    id: "6",
    title: "Eco-Friendly Packaging Solutions",
    creator: "Pure Pack",
    description: "Biodegradable packaging alternatives for businesses",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
    fundingGoal: 60000,
    currentFunding: 47200,
    backers: 198,
    daysLeft: 22,
    category: "Environment",
  },
  {
    id: "7",
    title: "Mindfulness Meditation App",
    creator: "Zen Digital",
    description: "AI-guided meditation sessions for stress relief",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    fundingGoal: 30000,
    currentFunding: 28450,
    backers: 567,
    daysLeft: 3,
    category: "Wellness",
  },
  {
    id: "8",
    title: "Retro Gaming Console",
    creator: "PixelCraft Studios",
    description: "Modern console playing classic 8-bit and 16-bit games",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    fundingGoal: 80000,
    currentFunding: 92100,
    backers: 734,
    daysLeft: 18,
    category: "Gaming",
  },
  {
    id: "9",
    title: "Portable Solar Charger",
    creator: "SolarTech Innovations",
    description: "High-efficiency solar panels for outdoor adventures",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
    fundingGoal: 45000,
    currentFunding: 38200,
    backers: 291,
    daysLeft: 11,
    category: "Technology",
  },
];

const categories = [
  "All",
  "Fashion",
  "Technology",
  "Food & Beverage",
  "Lifestyle",
  "Education",
  "Environment",
  "Wellness",
  "Gaming",
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = (campaign.currentFunding / campaign.fundingGoal) * 100;
  const isActive = campaign.daysLeft > 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        {isActive && (
          <Badge className="absolute top-3 left-3 bg-green-500 text-white">
            Active
          </Badge>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">
            {campaign.title}
          </h3>
          <p className="text-sm text-muted-foreground">by {campaign.creator}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {campaign.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatNumber(campaign.backers)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>${formatNumber(campaign.fundingGoal)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(1)}% funded</span>
            <span>{campaign.daysLeft} days left</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <Button className="w-full">Back this campaign</Button>
      </div>
    </Card>
  );
}

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || campaign.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Campaign Feed</h1>
              <p className="text-muted-foreground">
                Discover and back amazing projects
              </p>
            </div>
            <Button className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCampaigns.length} campaigns
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No campaigns found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

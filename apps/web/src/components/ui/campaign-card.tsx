"use client";

import { Users, Target, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/types/campaign";
import { formatNumber, formatCurrency, calculateProgress } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
  className?: string;
  onBackCampaign?: (campaignId: string) => void;
  variant?: "default" | "compact" | "featured";
}

export function CampaignCard({ 
  campaign, 
  className,
  onBackCampaign,
  variant = "default" 
}: CampaignCardProps) {
  const progress = calculateProgress(campaign.currentFunding, campaign.fundingGoal);
  const isActive = campaign.status === "active" && campaign.daysLeft > 0;

  const cardContent = (
    <>
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
        {campaign.status === "funded" && (
          <Badge className="absolute top-3 left-3 bg-blue-500 text-white">
            Funded
          </Badge>
        )}
      </div>
      
      <div className={cn(
        "space-y-4",
        variant === "compact" ? "p-4" : "p-6"
      )}>
        <div>
          <h3 className={cn(
            "font-semibold line-clamp-2 mb-1",
            variant === "compact" ? "text-base" : "text-lg"
          )}>
            {campaign.title}
          </h3>
          <p className="text-sm text-muted-foreground">by {campaign.creator}</p>
        </div>

        <p className={cn(
          "text-sm text-muted-foreground line-clamp-2",
          variant === "compact" && "line-clamp-1"
        )}>
          {campaign.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatNumber(campaign.backers)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{formatCurrency(campaign.fundingGoal)}</span>
          </div>
          {variant !== "compact" && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{campaign.daysLeft} days left</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(1)}% funded</span>
            {variant !== "compact" && (
              <span>{campaign.daysLeft} days left</span>
            )}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {variant !== "compact" && (
          <Button 
            className="w-full"
            onClick={() => onBackCampaign?.(campaign.id)}
            disabled={!isActive}
          >
            {isActive ? "Back this campaign" : "Campaign ended"}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-shadow duration-200",
      className
    )}>
      {cardContent}
    </Card>
  );
}
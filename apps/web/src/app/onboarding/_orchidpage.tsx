"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, User, UserCheck as UserHeart } from "lucide-react";
import Image from "next/image";

interface YouTubeAccount {
  name: string;
  thumbnail: string;
}

const mockYouTubeAccounts: YouTubeAccount[] = [
  {
    name: "TechCreator",
    thumbnail: "/api/placeholder/40/40",
  },
  {
    name: "Daily Vlogs",
    thumbnail: "/api/placeholder/40/40",
  },
];

const YouTubeAccountsSection = ({
  accounts,
}: {
  accounts: YouTubeAccount[];
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Your YouTube Accounts
        </h3>
        <p className="text-secondary-foreground">
          We've detected the following YouTube accounts associated with your
          Google account.
        </p>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <Youtube className="h-5 w-5 text-muted-foreground" />
            <p className="text-muted-foreground">
              No YouTube accounts found. You can still continue with the
              onboarding process.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {accounts.map((account, index) => (
            <Card
              key={index}
              className="p-4 bg-card border-border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={account.thumbnail}
                    alt={account.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{account.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    YouTube Channel
                  </p>
                </div>
                <Youtube className="h-5 w-5 text-primary" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

type ProfileType = "creator" | "fan";

const ProfileTypeSelector = ({
  onSelect,
}: {
  onSelect: (type: ProfileType) => void;
}) => {
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null);

  const handleSelect = (type: ProfileType) => {
    setSelectedType(type);
    onSelect(type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Choose Your Profile Type
        </h3>
        <p className="text-secondary-foreground">
          This helps us personalize your experience and show relevant features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
            selectedType === "creator"
              ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
              : "bg-card border-border hover:border-primary/20"
          }`}
          onClick={() => handleSelect("creator")}
        >
          <div className="text-center space-y-4">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                selectedType === "creator"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <User className="h-6 w-6" />
            </div>
            <div>
              <h4
                className={`text-lg font-semibold ${selectedType === "creator" ? "text-white" : "text-white"}`}
              >
                Creator
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                I create content and want to track my performance and grow my
                audience.
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
            selectedType === "fan"
              ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
              : "bg-card border-border hover:border-primary/20"
          }`}
          onClick={() => handleSelect("fan")}
        >
          <div className="text-center space-y-4">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                selectedType === "fan"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <UserHeart className="h-6 w-6" />
            </div>
            <div>
              <h4
                className={`text-lg font-semibold ${selectedType === "fan" ? "text-white" : "text-white"}`}
              >
                Fan
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                I love watching content and want to discover new creators and
                trends.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const OnboardingProfileTypeSection = () => {
  const [selectedProfileType, setSelectedProfileType] =
    useState<ProfileType | null>(null);

  const handleContinue = () => {
    if (selectedProfileType) {
      // Navigate or submit the profile type
      console.log("Selected profile type:", selectedProfileType);
    }
  };

  return (
    <div className="space-y-8">
      <ProfileTypeSelector onSelect={setSelectedProfileType} />

      <div className="flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={!selectedProfileType}
          size="lg"
          className="px-8 bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Welcome to YTRank! 🎉
            </h1>
            <p className="text-lg text-secondary-foreground max-w-lg mx-auto">
              Let's set up your account to give you the best personalized
              experience. This will only take a minute.
            </p>
          </div>

          {/* YouTube Accounts Section */}
          <YouTubeAccountsSection accounts={mockYouTubeAccounts} />

          {/* Profile Type Selection */}
          <OnboardingProfileTypeSection />
        </div>
      </div>
    </div>
  );
}

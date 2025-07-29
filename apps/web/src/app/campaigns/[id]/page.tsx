import { fetchQuery } from "convex/nextjs";
import { api } from "@packages/backend/convex/_generated/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout";
import { Button } from "@/components/ui";

interface CampaignPageProps {
  params: { id: string };
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const campaign = await fetchQuery(api.campaigns.getCampaign, {
    campaignId: params.id as any,
  });

  if (!campaign) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
        {campaign.image && (
          <div className="mb-6">
            <Image
              src={campaign.image}
              alt={campaign.title}
              width={800}
              height={450}
              className="rounded-lg w-full object-cover"
            />
          </div>
        )}
        <p className="text-muted-foreground mb-6">{campaign.description}</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <p className="text-xl font-semibold">Goal</p>
            <p>${campaign.goalAmount.toLocaleString()}</p>
          </div>
          <div className="flex-1">
            <p className="text-xl font-semibold">Raised</p>
            <p>${campaign.fundedAmount.toLocaleString()}</p>
          </div>
          <div className="flex-1">
            <p className="text-xl font-semibold">Deadline</p>
            <p>{new Date(campaign.deadline).toLocaleDateString()}</p>
          </div>
        </div>

        <Button className="w-full md:w-auto">Back This Campaign</Button>
      </div>
    </div>
  );
}
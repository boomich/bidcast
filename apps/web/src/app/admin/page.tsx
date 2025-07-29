"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Navigation } from "@/components/layout";
import { Button } from "@/components/ui";

export default function AdminDashboard() {
  const router = useRouter();
  const campaigns = useQuery(api.campaigns.listCampaigns, { status: undefined, search: undefined });
  const finalize = useMutation(api.crowdfunding.finalizeCampaign);

  if (!campaigns) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <table className="w-full text-left border">
          <thead>
            <tr className="border-b">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Goal</th>
              <th className="p-3">Raised</th>
              <th className="p-3">Deadline</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c: any) => (
              <tr key={c._id} className="border-b hover:bg-muted/50">
                <td className="p-3 cursor-pointer" onClick={() => router.push(`/campaigns/${c._id}`)}>{c.title}</td>
                <td className="p-3 capitalize">{c.status}</td>
                <td className="p-3">${c.goalAmount.toLocaleString()}</td>
                <td className="p-3">${c.fundedAmount.toLocaleString()}</td>
                <td className="p-3">{new Date(c.deadline).toLocaleDateString()}</td>
                <td className="p-3">
                  {c.status === "open" && (
                    <Button size="sm" onClick={() => finalize({ campaignId: c._id })}>
                      Force Finalize
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
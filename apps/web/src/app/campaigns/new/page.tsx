"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Navigation } from "@/components/layout";
import { Button, Input } from "@/components/ui";

export default function NewCampaignPage() {
  const router = useRouter();
  const createCampaign = useMutation(api.campaigns.createCampaign);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);
  const [deadline, setDeadline] = useState(""); // YYYY-MM-DD
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      const deadlineMs = new Date(deadline).getTime();
      const id = await createCampaign({ title, description, goalAmount, deadline: deadlineMs });
      router.push(`/campaigns/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Create Campaign</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              className="w-full border rounded-md p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Funding Goal (USD)</label>
            <Input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Deadline</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <Button onClick={submit} disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </div>
    </div>
  );
}
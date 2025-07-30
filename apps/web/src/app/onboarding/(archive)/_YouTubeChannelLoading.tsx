import { Youtube } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function YouTubeChannelLoading() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <Card className="p-8 gap-6 bg-card border-border">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Youtube className="w-8 h-8 text-muted-foreground animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Checking your YouTube channels...
            </h3>
            <p className="text-muted-foreground">
              We're checking your Google account for YouTube channels.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <div className="h-2 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}

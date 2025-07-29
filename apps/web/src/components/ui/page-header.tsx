import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  className?: string;
  sticky?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
  sticky = false,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-border bg-background/95 backdrop-blur-sm",
        sticky && "sticky top-0 z-10",
        className
      )}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              className="w-fit"
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
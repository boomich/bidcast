import { cn } from "@/lib/utils";

interface BidcastHeadingProps {
  title: string;
  subtitle: string;
  className?: string;
  subtitleClassName?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function BidcastHeading({
  title,
  subtitle,
  className,
  as = "h2",
  subtitleClassName,
}: BidcastHeadingProps) {
  const Heading = as;

  return (
    <Heading
      className={cn(
        "inline-block text-5xl md:text-6xl tracking-tight",
        className,
      )}
    >
      <span className="bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] bg-clip-text text-transparent">
        {title}
      </span>
      <br />
      <p className={cn("text-primary font-satoshi", subtitleClassName)}>
        {subtitle}
      </p>
    </Heading>
  );
}

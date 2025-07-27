import { cn } from "@/lib/utils";

const BidcastButton: React.FC<{
  children?: React.ReactNode;
  className?: string;
  variant?: "simple" | "outline" | "primary";
  as?: React.ElementType<any>;
  [x: string]: any;
}> = ({
  children,
  className,
  variant = "primary",
  as: Tag = "button" as any,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 px-8",
    simple:
      "bg-transparent border border-2 border-border hover:bg-muted text-foreground",
    outline:
      "bg-transparent border border-2 border-border hover:bg-muted text-foreground",
  };

  return (
    <Tag
      className={cn(
        "relative z-10 flex cursor-pointer items-center justify-center rounded-md px-6 h-11 text-md font-bold hover:shadow-glow hover:scale-105 transition duration-300",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default BidcastButton;

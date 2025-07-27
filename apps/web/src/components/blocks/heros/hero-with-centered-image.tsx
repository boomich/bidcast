"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function HeroWithCenteredImage() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden bg-background pt-20 md:pt-40">
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
        className="relative z-10 mx-auto mt-6 max-w-6xl text-center text-2xl font-semibold text-foreground md:text-4xl lg:text-8xl"
      >
        Scale Your Content Creation with Bidcast
      </motion.h1>
      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.2 }}
        className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-base text-secondary md:text-xl"
      >
        The all-in-one platform that helps creators plan, produce, and publish
        content across every channel. Join 50,000+ creators who&apos;ve
        transformed their workflow.
      </motion.p>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 0.5, delay: 0.4 }}
        className="relative z-10 mt-6 flex items-center justify-center gap-4"
      >
        <Button variant="primary">Start Free Trial</Button>
        <Button variant="simple">Watch Demo</Button>
      </motion.div>
      <div className="relative mt-20 rounded-[32px] border border-border bg-card p-4">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full scale-[1.1] bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="rounded-[24px] border border-border bg-background p-2">
          <Image
            src="https://assets.aceternity.com/aceternity-ui/dashboard.png"
            alt="Bidcast dashboard mockup"
            width={1920}
            height={1080}
            className="rounded-[20px]"
          />
        </div>
      </div>
    </div>
  );
}

export const Button: React.FC<{
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
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    simple:
      "bg-transparent border border-border hover:bg-muted text-foreground",
    outline:
      "bg-transparent border border-border hover:bg-muted text-foreground",
  };

  return (
    <Tag
      className={cn(
        "relative z-10 flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition duration-200",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

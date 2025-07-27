"use client";

import React from "react";

import { motion, Variants } from "motion/react";
import { Calendar, Film, Clock, ChartBarIncreasing } from "lucide-react";

import Heading from "@/components/ui/bc-heading";

const processData = [
  {
    step: 1,
    icon: Calendar,
    title: "Pitch an idea",
    description:
      "You propose content ideas. Use text and media to paint the picture. The creator sets a funding goal.",
  },
  {
    step: 2,
    icon: Film,
    title: "Back your favorites",
    description:
      "Place bids to support an idea. You pay upfront, but your money is refunded if the goal isn't met.",
  },
  {
    step: 3,
    icon: Clock,
    title: "Creator delivery",
    description:
      "When the funding goal is reached, the creator starts producing. The creator delivers the content to the backers.",
  },
  {
    step: 4,
    icon: ChartBarIncreasing,
    title: "Get the spotlight",
    description:
      "The top 3 backers get a shoutout from the creator. A little fame and bragging rights never hurt. Fans support. Creators thrive. Everyone wins.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ContentCreationProcess: React.FC = () => {
  return (
    <>
      <div className="relative isolate w-full overflow-visible px-4 py-16 md:py-40 pt-10 lg:px-4">
        <div className="pt-200 md:pt-160 mt-[500px]">
          <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg, #000 50px, transparent 100px)]">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.1)]"
              style={{
                width: "1400px",
                height: "1400px",
                clipPath: "circle(50% at 50% 50%)",
                background: `radial-gradient(
                circle at center,
                rgba(40, 40, 40, 0.8) 0%,
                rgba(20, 20, 20, 0.6) 30%,
                rgba(0, 0, 0, 0.4) 70%
              )`,
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
                  backgroundSize: "60px 120px",
                }}
              ></div>
            </div>
            <div
              className="absolute bg-black z-2 left-1/2 top-1/2  -translate-x-1/2 -translate-y-1/2 rounded-full  border border-[rgba(255,255,255,0.1)] shadow-[0_0_200px_80px_rgba(255,255,255,0.1)]"
              style={{ width: "1000px", height: "1000px" }}
            ></div>
          </div>
        </div>
        <div className="z-20 absolute inset-0 mt-70 md:mt-100">
          <div className="relative z-50 mx-auto mb-4 max-w-4xl text-center">
            <Heading title="How it works" subtitle="Fast track to funded" />
          </div>
          <p className="text-md text-neutral-400 mt-4 px-4 max-w-lg text-center mx-auto">
            Creators and fans post and back video, stream and podcast ideas in a
            few simple steps.
          </p>

          <div className="container mx-auto px-4 py-20 sm:py-24 lg:py-32 relative max-w-6xl z-20">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {processData.map((item) => (
                <motion.div
                  key={item.step + item.title}
                  className="flex flex-col p-6 text-left bg-card border border-border rounded-lg transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 8px 25px rgba(255, 60, 60, 0.08)",
                    borderColor: "rgba(255, 60, 60, 0.3)",
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  aria-labelledby={`${item.title.replace(/\s+/g, "-")}-title`}
                >
                  <div className="flex items-center gap-x-5 mb-5 h-16 justify-center">
                    <span className="text-5xl font-bold text-primary">
                      {`0${item.step}`}
                    </span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                      <item.icon
                        className="h-8 w-8 text-primary"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl text-left font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-base text-balance text-secondary">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[20em] min-[370px]:h-[18em] min-[396px]:h-[10em] min-[540px]:h-[4em] sm:-mt-30"></div>
    </>
  );
};

export default ContentCreationProcess;

"use client";

import React from "react";
import { motion, Variants } from "motion/react";
import { Calendar, Play, ChartBar } from "lucide-react";

import Heading from "@/components/ui/bc-heading";

const featuresData = [
  {
    icon: Calendar,
    title: "Validate ideas before investing hours editing",
    description:
      "Only produce what your audience truly wants. Skip the guesswork, and stop wasting time on content no one asked for.",
    ariaLabel: "Content Calendar Feature",
  },
  {
    icon: Play,
    title: "Get paid upfront",
    description:
      "Receive funding before you hit “record.” No more waiting for sponsorships or hoping for ad revenue later.",
    ariaLabel: "Video Editor Feature",
  },
  {
    icon: ChartBar,
    title: "Build deeper trust with your audience",
    description:
      "Your fans become collaborators. They’re not just watching, they’re helping you grow. That’s powerful.",
    ariaLabel: "Analytics Dashboard Feature",
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

const CreatorFeaturesGrid = () => {
  return (
    <section className="bg-background font-sans w-full py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <Heading title="Built for" subtitle="Creators" />
          <p className="mt-4 text-lg text-muted-foreground">
            Skip the guesswork. Let your fans decide what’s worth making.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuresData.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="flex flex-col p-6 text-left bg-card border border-border rounded-lg transition-all duration-300"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 8px 25px rgba(255, 60, 60, 0.08)",
                  borderColor: "rgba(255, 60, 60, 0.3)",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                aria-labelledby={`${feature.title.replace(/\s+/g, "-")}-title`}
              >
                <div className="mb-5">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-muted">
                    <IconComponent
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3
                  id={`${feature.title.replace(/\s+/g, "-")}-title`}
                  className="text-xl font-semibold text-card-foreground"
                >
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CreatorFeaturesGrid;

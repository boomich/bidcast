"use client";

import { motion } from "motion/react";

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import Button from "@/components/ui/bc-button";
import Link from "next/link";

export default function SimpleCenteredWithGradient() {
  return (
    <div className="overflow-hidden bg-background">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="inline-block text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_70%,#888787_120%,#3B3B3B_120%)] bg-clip-text text-transparent">
              Ready to make content history?
            </span>
            <br />
            <span className="text-primary">Join Bidcast now.</span>
          </h2>

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center flex-col sm:flex-row gap-4 relative z-10 mt-10 px-8"
          >
            <SignedOut>
              <Link href="/sign-up">
                <Button className="w-full sm:w-auto" variant="primary">
                  Get started. Make content happen.
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="w-full sm:w-auto" variant="simple">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/feed">
                <Button className="w-full sm:w-auto" variant="primary">
                  Go to campaign feed
                </Button>
              </Link>
            </SignedIn>
          </motion.div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sign up for free. No credit card required. Check our live campaigns.
          </p>
        </div>
      </div>
    </div>
  );
}

import { CampaignCategory } from "@/types/campaign";

export const APP_CONFIG = {
  name: "Bidcast",
  description: "Empower your audience to drive your content decisions.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  version: "1.0.0",
} as const;

export const NAVIGATION = {
  main: [
    { name: "Home", href: "/" },
    { name: "Feed", href: "/feed" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  footer: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
} as const;

export const CAMPAIGN_CATEGORIES: CampaignCategory[] = [
  "Fashion",
  "Technology",
  "Food & Beverage",
  "Lifestyle",
  "Education",
  "Art",
  "Music",
  "Film",
  "Gaming",
  "Health",
  "Environment",
  "Other",
];

export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
  defaultPage: 1,
} as const;

export const SEARCH = {
  debounceMs: 300,
  minQueryLength: 2,
  maxResults: 100,
} as const;

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
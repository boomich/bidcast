"use client";

import * as React from "react";

import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ErrorBoundary } from "@/app/ErrorBoundary";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // NOTE: Once you get Clerk working you can remove this error boundary
    <ErrorBoundary>
      <NextThemesProvider
        enableSystem
        attribute="class"
        enableColorScheme
        defaultTheme="system"
        disableTransitionOnChange
      >
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </NextThemesProvider>
    </ErrorBoundary>
  );
}

(globalThis as any).packageName = "@clerk/nextjs";

import localFont from "next/font/local";
import { Inter } from "next/font/google";

import type { Metadata } from "next";

import "@packages/ui/globals.css";

import { cn } from "@packages/ui/lib/utils";

import Providers from "@/components/providers";

const InterFont = Inter({ subsets: ["latin"] });

const SatoshiFont = localFont({
  src: "../../public/fonts/Satoshi-Variable.woff2",
});

export const metadata: Metadata = {
  title: "Bidcast",
  description: "Empower your audience to drive your content decisions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          InterFont.className,
          SatoshiFont.className,
          "font-sans antialiased",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

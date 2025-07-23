(globalThis as any).packageName = '@clerk/nextjs';

import type { Metadata } from "next";
import { Inter, Montserrat, Lato } from "next/font/google";
import "@packages/ui/globals.css";

import { cn } from "@packages/ui/lib/utils";

import Providers  from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes App",
  description: "This is an app to take notes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, montserrat.className, lato.className, "font-sans antialiased")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

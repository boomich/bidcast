import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Bidcast",
  description: "Sign in to your Bidcast account",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
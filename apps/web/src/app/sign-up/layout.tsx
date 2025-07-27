import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Bidcast",
  description: "Create your Bidcast account and start empowering your audience",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
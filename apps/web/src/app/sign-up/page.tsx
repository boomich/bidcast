"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Get started with your free account today
          </p>
        </div>

        {/* Sign Up Component Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600",
                socialButtonsBlockButtonText: "text-slate-700 dark:text-slate-200 font-medium",
                dividerLine: "bg-slate-300 dark:bg-slate-600",
                dividerText: "text-slate-500 dark:text-slate-400",
                formFieldInput: "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white",
                formFieldLabel: "text-slate-700 dark:text-slate-300",
                formButtonPrimary: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900",
                footerActionLink: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                identityPreviewText: "text-slate-600 dark:text-slate-400",
                identityPreviewEditButton: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                formFieldSuccessText: "text-green-600 dark:text-green-400",
                formFieldErrorText: "text-red-600 dark:text-red-400",
                formFieldWarningText: "text-yellow-600 dark:text-yellow-400",
              },
            }}
            redirectUrl="/onboarding"
            signInUrl="/sign-in"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link 
              href="/sign-in" 
              className="text-slate-900 dark:text-white font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center mt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-slate-700 dark:hover:text-slate-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-slate-700 dark:hover:text-slate-300">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-200 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 left-1/4 w-64 h-64 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
      </div>
    </div>
  );
}
import { Suspense } from "react";
import YouTubeChannelSettings from "@/components/settings/YouTubeChannelSettings";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              YouTube Channels
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your connected YouTube channels and select your active channel.
            </p>
          </div>
          
          <div className="p-6">
            <Suspense fallback={
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            }>
              <YouTubeChannelSettings />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
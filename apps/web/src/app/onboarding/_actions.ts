"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async () => {
  const { userId } = await auth();
  if (!userId) return { message: "No Logged In User" };

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      // Keep onboardingComplete in publicMetadata for middleware check
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { success: true };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};

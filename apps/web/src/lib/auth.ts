export async function getAuthToken(): Promise<string | undefined> {
  // Dynamically import to avoid issues during edge/server runtime initialization.
  const { auth } = await import("@clerk/nextjs/server");

  // Clerk recommends creating a JWT template named "convex" for Convex integration.
  // https://docs.convex.dev/client/react/nextjs/server-rendering#server-side-authentication
  const token = await auth().getToken({ template: "convex" });
  return token ?? undefined;
}
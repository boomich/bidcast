// app/oauth-callback/[[...rest]]/page.tsx
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function OAuthCallbackPage() {
  return <AuthenticateWithRedirectCallback />;
}

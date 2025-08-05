/*
* PayPal helper library — wraps the REST API for simple one-time payments.
*
* We deliberately avoid the full `@paypal/checkout-server-sdk` client in order to
* keep the bundle small and have tighter control over retries / logging.
* Only `fetch()` is used so the code runs in any modern Node or Edge runtime.
*
* References
*  - https://developer.paypal.com/docs/api/orders/v2/
*  - https://developer.paypal.com/api/rest/#token-request
*  - https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
*/

import { randomUUID } from "node:crypto";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

const {
  PAYPAL_CLIENT_ID = "",
  PAYPAL_CLIENT_SECRET = "",
  PAYPAL_MODE = "sandbox", // "live" for production
  PAYPAL_WEBHOOK_ID = "",
} = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn(
    "[paypal] Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET env vars – PayPal endpoints will throw until configured."
  );
}

const PAYPAL_API_BASE =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// ---------------------------------------------------------------------------
// Access-token management (in-memory cache)
// ---------------------------------------------------------------------------

let cachedBearer: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedBearer && cachedBearer.expiresAt - now > 60_000 /* >1min left */) {
    return cachedBearer.token;
  }

  const basicAuth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
    "utf8"
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`paypal: failed to fetch access token – ${res.status} ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };

  cachedBearer = {
    token: data.access_token,
    // refresh 5 min before expiration
    expiresAt: now + (data.expires_in - 5 * 60) * 1000,
  };

  return cachedBearer.token;
}

// ---------------------------------------------------------------------------
// Types & validation schemas
// ---------------------------------------------------------------------------

export const CreateOrderInputSchema = z.object({
  amount: z
    .number({ invalid_type_error: "amount must be a number" })
    .positive()
    .max(1000),
  currency: z.string().default("USD"),
  referenceId: z.string().min(3), // campaignId
});

export type CreateOrderInput = z.input<typeof CreateOrderInputSchema>;

export const CaptureOrderResponseSchema = z.object({
  captureId: z.string(),
  status: z.string(),
  amount: z.object({ currency_code: z.string(), value: z.string() }),
});

export type CaptureOrderResponse = z.infer<typeof CaptureOrderResponseSchema>;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
* Creates a PayPal Order and returns { orderId, approveUrl }.
*/
export async function createOrder(input: CreateOrderInput) {
  const { amount, currency, referenceId } = CreateOrderInputSchema.parse(input);

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: referenceId,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
    application_context: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://bidcast.app"}/paypal/return`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://bidcast.app"}/paypal/cancel`,
    },
  };

  const bearer = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": randomUUID(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`paypal:createOrder failed – ${res.status} ${text}`);
  }

  const data: any = await res.json();
  const approveUrl: string | undefined = data.links?.find((l: any) => l.rel === "approve")?.href;

  if (!approveUrl) {
    throw new Error("paypal:createOrder – approve link missing");
  }

  return {
    orderId: data.id as string,
    approveUrl,
  } as const;
}

/**
* Captures a previously approved PayPal Order.
*/
export async function captureOrder(orderId: string): Promise<CaptureOrderResponse> {
  if (!orderId) throw new Error("paypal:captureOrder – orderId required");

  const bearer = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": randomUUID(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`paypal:captureOrder failed – ${res.status} ${text}`);
  }

  const data: any = await res.json();

  const capture =
    data?.purchase_units?.[0]?.payments?.captures?.[0] ?? undefined;

  if (!capture) {
    throw new Error("paypal:captureOrder – capture object missing in response");
  }

  const parsed: CaptureOrderResponse = {
    captureId: capture.id,
    status: capture.status,
    amount: capture.amount,
  };

  return parsed;
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

export async function verifyWebhookSignature(
  headers: Record<string, string | undefined>,
  body: unknown
): Promise<boolean> {
  if (!PAYPAL_WEBHOOK_ID) {
    console.warn("[paypal] PAYPAL_WEBHOOK_ID not set — skipping signature verify");
    return true; // fail-open in dev
  }

  const required = [
    "paypal-transmission-id",
    "paypal-transmission-time",
    "paypal-transmission-sig",
    "paypal-cert-url",
    "paypal-auth-algo",
  ];

  for (const h of required) {
    if (!headers[h]) {
      console.warn(`[paypal] Missing header ${h}`);
      return false;
    }
  }

  const bearer = await getAccessToken();

  const verifyBody = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: body,
  };

  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyBody),
    }
  );

  if (!res.ok) {
    console.error("[paypal] verify signature API failed", res.status);
    return false;
  }

  const data: any = await res.json();
  return data.verification_status === "SUCCESS";
}

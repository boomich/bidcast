import { createOrder, captureOrder } from "../../src/lib/services/paypal";
import nock from "nock";

const BASE = "https://api-m.sandbox.paypal.com";

// Disable network calls except nock
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.stubGlobal("fetch", (input: RequestInfo | URL, init?: RequestInit) =>
  import("node-fetch").then(({ default: fetch }) => fetch(input, init))
);

describe("paypal service", () => {
  beforeAll(() => {
    process.env.PAYPAL_CLIENT_ID = "test-id";
    process.env.PAYPAL_CLIENT_SECRET = "test-secret";
    process.env.PAYPAL_MODE = "sandbox";
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it("creates and captures an order", async () => {
    // Mock OAuth token
    nock(BASE)
      .post("/v1/oauth2/token")
      .reply(200, { access_token: "tok", expires_in: 3600 });

    // Mock create order
    nock(BASE)
      .post("/v2/checkout/orders")
      .reply(201, {
        id: "ORDER123",
        links: [{ rel: "approve", href: "https://paypal.com/approve?token=ORDER123" }],
      });

    // Mock capture
    nock(BASE)
      .post("/v2/checkout/orders/ORDER123/capture")
      .reply(201, {
        id: "ORDER123",
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: "CAPTURE123",
                  status: "COMPLETED",
                  amount: { currency_code: "USD", value: "10.00" },
                },
              ],
            },
          },
        ],
      });

    const { orderId, approveUrl } = await createOrder({
      amount: 10,
      referenceId: "CAM-abc",
    });

    expect(orderId).toBe("ORDER123");
    expect(approveUrl).toContain("approve?token=ORDER123");

    const capture = await captureOrder(orderId);

    expect(capture.captureId).toBe("CAPTURE123");
    expect(capture.status).toBe("COMPLETED");
    expect(capture.amount.value).toBe("10.00");
  });
});

import { NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  CaptureOrderResponseSchema,
} from "@/lib/services/paypal";

export async function POST(req: Request) {
  // Raw text is needed for signature verification.
  const bodyText = await req.text();
  const headers = Object.fromEntries(
    Array.from(req.headers.entries()).map(([k, v]) => [k.toLowerCase(), v])
  );

  const isValid = await verifyWebhookSignature(headers, JSON.parse(bodyText));

  if (!isValid) {
    console.warn("[paypal] invalid webhook signature, ignoring");
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(bodyText);

  // Process only capture events for now.
  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const parse = CaptureOrderResponseSchema.safeParse({
      captureId: event.resource.id,
      status: event.resource.status,
      amount: event.resource.amount,
    });

    if (!parse.success) {
      console.error("[paypal] webhook resource validation failed", parse.error);
    } else {
      // TODO: call Convex mutation to record payment (follow-up ticket)
      console.info("[paypal] capture completed", parse.data.captureId);
    }
  }

  return NextResponse.json({ received: true });
}

import { NextResponse } from "next/server";
import { createOrder } from "@/lib/services/paypal";
import { z } from "zod";

const BodySchema = z.object({
  campaignId: z.string().min(3),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { campaignId, amount } = BodySchema.parse(json);

    const { orderId, approveUrl } = await createOrder({
      amount,
      referenceId: campaignId,
    });

    return NextResponse.json({ orderId, approveUrl });
  } catch (err) {
    console.error("[paypal] create-order error", err);

    return NextResponse.json(
      {
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/services/paypal";
import { z } from "zod";

const BodySchema = z.object({
  orderId: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { orderId } = BodySchema.parse(json);

    const capture = await captureOrder(orderId);

    return NextResponse.json({ success: true, capture });
  } catch (err) {
    console.error("[paypal] capture-order error", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

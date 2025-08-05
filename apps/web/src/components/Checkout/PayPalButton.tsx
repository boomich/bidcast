"use client";

import { useEffect, useRef } from "react";

interface PayPalButtonProps {
  campaignId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

export function PayPalButton({
  campaignId,
  amount,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // If the SDK script already exists we don't append it again.
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-paypal-sdk]"
    );

    const createButtons = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paypal: any = (window as any).paypal;
      if (!paypal) {
        onError?.(new Error("PayPal SDK failed to load"));
        return;
      }

      paypal
        .Buttons({
          async createOrder() {
            const res = await fetch("/api/payments/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ campaignId, amount }),
            });

            if (!res.ok) {
              throw new Error("Failed to create order");
            }

            const data = (await res.json()) as { orderId: string };
            return data.orderId;
          },
          async onApprove(data: { orderID: string }) {
            const res = await fetch("/api/payments/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });

            if (!res.ok) {
              throw new Error("Failed to capture order");
            }

            onSuccess?.();
          },
          onError(err: Error) {
            onError?.(err);
          },
        })
        .render(containerRef.current);
    };

    if (existing) {
      if ((window as any).paypal) {
        createButtons();
      } else {
        existing.addEventListener("load", createButtons);
      }
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.dataset.paypalSdk = "true";
    script.addEventListener("load", createButtons);
    script.addEventListener("error", () => onError?.(new Error("PayPal SDK load error")));

    document.body.appendChild(script);

    // cleanup on unmount
    return () => {
      // note: we don't remove script to allow reuse across mounts
    };
  }, [campaignId, amount, onSuccess, onError]);

  return <div ref={containerRef} />;
}

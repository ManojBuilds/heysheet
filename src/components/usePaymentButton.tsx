"use client";

import { useCallback, useEffect, useRef } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export const usePaymentButton = () => {
  const { user } = useUser();
  const paddleRef = useRef<Paddle | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const paddle = await initializePaddle({
          environment:
            process.env.NODE_ENV === "production" ? "production" : "sandbox",
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_SIDE_TOKEN!,
        });
        paddleRef.current = paddle;
        console.log("✅ Paddle initialized");
      } catch (error) {
        console.error("❌ Paddle initialization failed:", error);
      }
    })();
  }, []);

  const handlePayment = useCallback(
    async (priceId: string) => {
      const paddle = paddleRef.current;

      if (!paddle) {
        toast.error("Paddle is not initialized yet. Please wait a moment.");
        return;
      }

      if (!user?.id) {
        toast.error("User not found");
        return;
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: {
          user_id: user.id,
        },
        settings: {
          theme: "dark",
          displayMode: "overlay",
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        },
      });
    },
    [user],
  );

  return { handlePayment };
};

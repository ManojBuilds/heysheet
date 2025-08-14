"use client";

import { Button } from "@/components/ui/button";
import { CheckoutEvent, DodoPayments } from "dodopayments-checkout";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { config } from "@/config";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  productId: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  autoOpen?: boolean;
}
interface CheckoutState {
  status: "idle" | "loading" | "open" | "error";
  error?: string;
}

export function CheckoutButton({
  productId,
  disabled,
  children,
  className,
  autoOpen,
}: CheckoutButtonProps) {
  const { isLoaded, user } = useUser();
  const { resolvedTheme } = useTheme();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    status: "idle",
  });

  const ListinEvents = (event: CheckoutEvent) => {
    switch (event.event_type) {
      case "checkout.opened":
        setCheckoutState({ status: "open" });
        break;

      case "checkout.closed":
        setCheckoutState({ status: "idle" });
        break;

      case "checkout.redirect":
        setCheckoutState({ status: "loading" });
        window.location.href = event.data?.url as string;
        break;

      case "checkout.error":
        setCheckoutState({
          status: "error",
          error: (event.data?.message as string) || "An error occurred",
        });
        break;
    }
  };

  useEffect(() => {
    DodoPayments.Initialize({
      displayType: "overlay",
      mode: process.env.NODE_ENV === "production" ? "live" : "test",
      linkType: "static",
      theme: resolvedTheme as "dark" | "light",
      onEvent: (event: CheckoutEvent) => {
        ListinEvents(event);
      },
    });
  }, [resolvedTheme]);

  const handleCheckout = useCallback(async () => {
    if (!isLoaded) return;
    try {
      setCheckoutState({ status: "loading" });
      DodoPayments.Checkout.open({
        redirectUrl: `${config.appUrl}/dashboard`,
        products: [
          {
            productId,
            quantity: 1,
          },
        ],
        queryParams: {
          fullName: user?.fullName || user?.firstName || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
        },
      });
    } catch (error) {
      console.log("error", error);
      setCheckoutState({
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to open checkout",
      });
      throw error;
    }
  }, [productId, isLoaded, user]);

  useEffect(() => {
    if (autoOpen && isLoaded) {
      handleCheckout();
    }
  }, [autoOpen, handleCheckout, isLoaded]);

  return (
    <Button
      className={className}
      onClick={handleCheckout}
      disabled={disabled || !isLoaded || checkoutState.status === 'loading'}
    >
      {checkoutState.status === "loading" ? (
        <>
          <Loader2 className="animate-spin mr-2" />
          Processing...
        </>
      ) : (
        children || "Checkout Now"
      )}
    </Button>
  );
}
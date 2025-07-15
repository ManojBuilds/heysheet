"use client";

import { Button } from "@/components/ui/button";
import { CheckoutEvent, DodoPayments } from "dodopayments-checkout";
import { useCallback, useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { config } from "@/config";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createDodopaymentsCheckoutSession } from "@/actions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

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
  const { openSignIn } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const isMobile = useIsMobile();
  const router = useRouter();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    status: "idle",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<string>("");

  const { mutateAsync: createCheckoutSession } = useMutation({
    mutationKey: ["payment_link"],
    mutationFn: async ({
      name,
      email,
      productId,
    }: {
      name: string;
      email: string;
      productId: string;
    }) => createDodopaymentsCheckoutSession({ name, email, productId }),
  });

  const ListinEvents = (event: CheckoutEvent) => {
    console.log("Checkout event:", event);

    switch (event.event_type) {
      case "checkout.opened":
        toast.error("checkout.opened");
        setCheckoutState({ status: "open" });
        setMessage("Checkout opened");
        break;

      case "checkout.closed":
        setCheckoutState({ status: "idle" });
        setMessage("Checkout closed");
        break;

      case "checkout.redirect":
        setCheckoutState({ status: "loading" });
        window.location.href = event.data?.url as string;
        setMessage("Redirecting to payment page");
        break;

      case "checkout.error":
        setCheckoutState({
          status: "error",
          error: (event.data?.message as string) || "An error occurred",
        });
        setMessage("An error occurred");
        throw new Error("Checkout.error");
        break;
    }
  };

  useEffect(() => {
    if (isMobile) return;
    DodoPayments.Initialize({
      displayType: "overlay",
      linkType: "static",
      mode: process.env.NODE_ENV === "production" ? "live" : "test",
      theme: "dark",
      onEvent: (event: CheckoutEvent) => {
        ListinEvents(event);
      },
    });
  }, []);

  const handleCheckout = useCallback(async () => {
    try {
      toast.info("Clicked checkout");
      if (!isLoaded) return;
      if (isMobile) {
        const checkoutSession = await createCheckoutSession({
          name: user?.fullName || user?.firstName || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
          productId,
        });
        if (!checkoutSession.success) {
          toast.error(checkoutSession.message || "Something went wrong!");
          return;
        }
        if (checkoutSession.link) {
          router.push(checkoutSession.link);
        }
      }
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
      toast.error("error");
      console.log("error", error);
      setCheckoutState({
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to open checkout",
      });
      throw error;
    }
  }, [isSignedIn, openSignIn, productId, isLoaded, user]);

  useEffect(() => {
    if (autoOpen && isLoaded) {
      handleCheckout();
    }
  }, [autoOpen, handleCheckout, isLoaded]);

  return (
    <Button
      className={className}
      onClick={handleCheckout}
      disabled={isLoading || disabled || !isLoaded}
    >
      {isLoading ? "Loading..." : children || "Checkout Now"}
    </Button>
  );
}

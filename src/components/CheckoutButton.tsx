"use client";

import { Button } from "@/components/ui/button";
import { CheckoutEvent, DodoPayments } from "dodopayments-checkout";
import { useCallback, useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

interface CheckoutButtonProps {
  productId: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
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
}: CheckoutButtonProps) {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    status: "idle",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<string>("");

  const ListinEvents = (event: CheckoutEvent) => {
    console.log("Checkout event:", event);

    switch (event.event_type) {
      case "checkout.opened":
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
        break;
    }
  };

  useEffect(() => {
    DodoPayments.Initialize({
      displayType: "overlay",
      linkType: "static",
      mode: "test",
      theme: "dark",
      onEvent: (event: CheckoutEvent) => {
        ListinEvents(event);
      },
    });
  }, []);

  // const handleCheckout = async () => {
  //     try {
  //         setIsLoading(true);
  //         await DodoPayments.Checkout.open({
  //             products: [
  //                 {
  //                     productId: "pdt_OzGLRmdGJ1qzvGyXdIpFL",
  //                     quantity: 1,
  //                 },
  //             ],
  //             redirectUrl: "https://app.dodopayments.com/home"

  //             // redirectUrl: `${window.location.origin}/dashboard`,
  //             // queryParams: {
  //             //     email: user?.emailAddresses[0]?.emailAddress || "",
  //             //     disableEmail: "true",
  //             // },
  //         });
  //     } catch (error) {
  //         console.error("Failed to open checkout:", error);
  //         setIsLoading(false);
  //     }
  // };
  const handleCheckout = useCallback(() => {
    try {
      if (!isSignedIn) {
        openSignIn();
        return;
      }
      setCheckoutState({ status: "loading" });
      DodoPayments.Checkout.open({
        redirectUrl: `${window.location.origin}/dashboard`,
        products: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    } catch (error) {
      setCheckoutState({
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to open checkout",
      });
    }
  }, []);

  return (
    <Button
      className={className}
      onClick={handleCheckout}
      disabled={isLoading || disabled}
    >
      {isLoading ? "Loading..." : children || "Checkout Now"}
    </Button>
  );
}

"use client";

import { createCustomerPortalSession } from "@/actions";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function ManageBillingButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const session = await createCustomerPortalSession(); // server action
        if (session?.link) {
          window.location.href = session.link;
        } else {
          toast.error("No billing portal link returned.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to open billing portal.");
      }
    });
  };

  return (
    <Button variant="outline" onClick={handleClick} disabled={isPending}>
      {isPending ? "Redirecting..." : "Manage Billing"}
    </Button>
  );
}

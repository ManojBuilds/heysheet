"use client";

import { createCustomerPortalSession } from "@/actions";
import { useTransition } from "react";
import { Button } from "./ui/button";

export function ManageBillingButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        startTransition(async () => {
          await createCustomerPortalSession();
        });
      }}
    >
      <Button variant="outline" type="submit" disabled={isPending}>
        {isPending ? "Redirecting..." : "Manage Billing"}
      </Button>
    </form>
  );
}

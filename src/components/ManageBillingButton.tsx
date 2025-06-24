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
          const session = await createCustomerPortalSession();
          if(session){
            window.location.href = session.link
          }
        });
      }}
    >
      <Button variant="outline" type="submit" disabled={isPending}>
        {isPending ? "Redirecting..." : "Manage Billing"}
      </Button>
    </form>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CrownIcon } from "lucide-react";
import { ManageBillingButton } from "@/components/ManageBillingButton";

export default function ManagePlanPage() {
  const { data: subscription, isLoading } = useSubscription();

  const plan = subscription?.plan || "free";
  const isFree = plan === "free";
  const renewalDate = subscription?.next_billing;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Manage Plan</h1>

      <Card className="mb-8 dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b dark:border-zinc-800">
          <div>
            <CardTitle className="text-zinc-900 dark:text-zinc-100">Your Current Plan</CardTitle>
            <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400">
              View and manage your subscription details.
            </CardDescription>
          </div>
          <Badge
            variant={isFree ? "outline" : "default"}
            className="text-sm capitalize dark:text-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            {plan}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-3/4" />
            </div>
          ) : (
            <>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                You are currently on the{" "}
                <strong className="text-xl text-zinc-900 dark:text-zinc-100">{plan}</strong> plan.
              </p>

              {!isFree && renewalDate && (
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Your plan renews on{" "}
                  <strong className="text-xl text-zinc-900 dark:text-zinc-100">
                    {format(new Date(renewalDate), "MMMM d, yyyy")}
                  </strong>
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={"/checkout"}
                  className={cn(buttonVariants(), "dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-50")}
                >
                  <CrownIcon className="text-yellow-500" />
                  Upgrade plan
                </Link>

                {!isFree && <ManageBillingButton />}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

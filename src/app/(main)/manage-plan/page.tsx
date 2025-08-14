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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CrownIcon } from "lucide-react";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { Suspense } from "react";
import { getSubscription } from "@/actions";
import { auth } from "@clerk/nextjs/server";

export default function ManagePlanPage() {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        Manage Plan
      </h1>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <ManagePlan />
      </Suspense>
    </div>
  );
}

async function ManagePlan() {
  const subscription = await getSubscription();

  const plan = subscription?.plan || "free";
  const status = subscription?.status;
  const renewalDate = subscription?.next_billing;
  const isFree = plan === "free";
  const isTrialing = status === "trialing";

  const formattedRenewalDate = renewalDate
    ? format(new Date(renewalDate), "MMMM d, yyyy")
    : null;

  const planText = isTrialing ? `${plan} (Trial)` : plan;

  return (
    <Card className="mb-8 dark:bg-zinc-900 dark:border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b dark:border-zinc-800">
        <div>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">
            Your Current Plan
          </CardTitle>
          <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400 pt-1">
            View and manage your subscription details.
          </CardDescription>
        </div>
        <Badge
          variant={isFree ? "outline" : "default"}
          className="text-sm capitalize dark:text-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          {planText}
        </Badge>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          You are currently on the{" "}
          <strong className="text-xl text-zinc-900 dark:text-zinc-100 capitalize">
            {planText}
          </strong>{" "}
          plan.
        </p>

        {formattedRenewalDate && (
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {isTrialing ? "Your trial ends on" : "Your plan renews on"}{" "}
            <strong className="text-xl text-zinc-900 dark:text-zinc-100">
              {formattedRenewalDate}
            </strong>
            {isTrialing
              ? ". After the trial, your plan will begin and you will be charged."
              : "."}
          </p>
        )}

        <div className="flex items-center gap-2 pt-2">
          {isFree && (
            <Link
              href={"/checkout"}
              className={cn(
                buttonVariants(),
                "dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-50",
              )}
            >
              <CrownIcon className="mr-2 h-4 w-4 text-yellow-500" />
              Upgrade to Pro
            </Link>
          )}

          {!isFree && <ManageBillingButton />}
        </div>
      </CardContent>
    </Card>
  );
}

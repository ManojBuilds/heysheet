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

export default function ManagePlanPage() {
  const { data: subscription, isLoading } = useSubscription();

  const plan = subscription?.plan || "free";
  const isFree = plan === "free";
  const renewalDate = subscription?.current_period_end;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Manage Plan</h1>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
          <div>
            <CardTitle>Your Current Plan</CardTitle>
            <CardDescription className="text-sm">
              View and manage your subscription details.
            </CardDescription>
          </div>
          <Badge
            variant={isFree ? "outline" : "default"}
            className="text-sm capitalize"
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
              <p className="text-muted-foreground text-sm">
                You are currently on the{" "}
                <strong className="text-xl">{plan}</strong> plan.
              </p>

              {!isFree && renewalDate && (
                <p className="text-sm text-muted-foreground">
                  Your plan renews on{" "}
                  <strong className="text-xl">
                    {format(new Date(renewalDate), "MMMM d, yyyy")}
                  </strong>
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={"/checkout"}
                  target="_blank"
                  className={cn(buttonVariants())}
                >
                  <CrownIcon className="text-yellow-500" />
                  Upgrade plan
                </Link>

                {!isFree && (
                  <Link
                    href={process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_LINK!}
                    target="_blank"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Manage Billing
                  </Link>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

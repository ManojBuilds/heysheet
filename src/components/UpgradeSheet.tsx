"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, CrownIcon, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { PLANS } from "@/lib/planLimits";
import { usePaymentButton } from "./usePaymentButton";
import useSubscription from "@/hooks/useSubscription";

export default function UpgradeSheet() {
  const [open, setOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useUser();
  const { data: subscription } = useSubscription();
  const { handlePayment } = usePaymentButton();

  const handleUpgrade = async (plan: any, isAnnual: boolean) => {
    if (!user?.id) return;
    const billing = isAnnual ? "annually" : "monthly";
    const priceId = plan.price[billing].priceId;

    console.log('hello', user?.id, billing, priceId )
    if (!priceId) {
      console.error("Missing priceId");
      return;
    }
    await handlePayment(priceId);
    setOpen(false)
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          leftIcon={<CrownIcon className="w-4 h-4 text-yellow-600" />}
          className="w-full"
        >
          Upgrade Plan
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="h-svh overflow-y-auto sm:max-w-5xl p-6"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Choose a Plan</SheetTitle>
          <SheetDescription>
            Pick a plan that fits your form needs. Upgrade anytime.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex items-center justify-center gap-4 mb-6">
          <span
            className={cn(
              "text-sm",
              !isAnnual ? "text-zinc-100 font-semibold" : "text-zinc-500",
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={cn(
              "relative w-14 h-8 rounded-full transition-colors duration-300",
              isAnnual
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-zinc-700",
            )}
          >
            <div
              className={cn(
                "absolute w-6 h-6 bg-white rounded-full top-1 transition-transform duration-300 shadow-sm",
                isAnnual ? "translate-x-7" : "translate-x-1",
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm",
              isAnnual ? "text-zinc-100 font-semibold" : "text-zinc-500",
            )}
          >
            Annual{" "}
            <span className="ml-1 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">
              (20% off)
            </span>
          </span>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {PLANS.map((plan, i) => {
            const billing = isAnnual ? "annually" : "monthly";
            const priceInfo = plan.price[billing];
            const isCurrent =
              subscription?.plan?.toLowerCase() === plan.name.toLowerCase();

            return (
              <div
                key={i}
                className={cn(
                  "relative p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between",
                  plan.popular
                    ? "border-green-500/50 bg-gradient-to-b from-green-900/20 to-emerald-900/20 shadow-xl shadow-green-500/20"
                    : "hover:border-green-500/30 shadow-sm hover:shadow-lg",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-zinc-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-zinc-100">
                      ${priceInfo.price}
                    </span>
                    <span className="text-zinc-400 ml-1">/month</span>
                    {isAnnual && priceInfo.price > 0 && (
                      <div className="text-sm text-zinc-500 mt-1">
                        Billed annually (${priceInfo.price * 12}/year)
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {plan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  {plan.name === "Free" ? (
                    <Button variant="outline" className="w-full py-6">
                      {isCurrent ? "Current Plan" : plan.cta}
                    </Button>
                  ) : (
                    <Button
                      disabled={!priceInfo.priceId || isCurrent}
                      onClick={() => handleUpgrade(plan, isAnnual)}
                      variant={"outline"}
                      className={cn(
                        "w-full py-6 font-semibold transition-all duration-300",
                        plan.popular &&
                          "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl shadow-green-500/25 hover:shadow-green-500/40 border-0",
                      )}
                    >
                      {isCurrent ? "Current Plan" : `Upgrade to ${plan.cta}`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

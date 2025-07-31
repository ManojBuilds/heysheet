"use client";
import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/planLimits";
import useSubscription from "@/hooks/useSubscription";
import { CheckoutButton } from "./CheckoutButton";
import useLoginOrRedirect from "@/hooks/useLoginOrReditrect";
import { config } from "@/config";

const PricingCard = () => {
  const loginOrRedirect = useLoginOrRedirect();
  const { data: subscription } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(
    subscription?.billing_interval === "annually",
  );
  const [copied, setCopied] = useState(false);
  const couponCode = config.couponeCode;

  const handleCopy = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPriceId = (plan: any): string =>
    plan.price[isAnnual ? "annually" : "monthly"].priceId;

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-10">
        <span
          className={cn(
            "text-sm",
            !isAnnual
              ? "text-zinc-900 dark:text-zinc-100 font-semibold"
              : "text-zinc-500 dark:text-zinc-400",
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
              : "bg-zinc-300 dark:bg-zinc-700",
          )}
          aria-label="Toggle billing period"
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
            isAnnual
              ? "text-zinc-900 dark:text-zinc-100 font-semibold"
              : "text-zinc-500 dark:text-zinc-400",
          )}
        >
          Annual{" "}
          <span className="ml-1 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">
            (20% off)
          </span>
        </span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PLANS.map((plan, i) => {
          const billing = isAnnual ? "annually" : "monthly";
          const priceInfo = plan.price[billing];
          const isCurrent =
            subscription?.plan?.toLowerCase() === plan.name.toLowerCase();

          if (plan.name === "Pro") return null;

          return (
            <div
              key={i}
              className={cn(
                "relative p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between",
                plan.popular
                  ? "border-green-500/50 bg-gradient-to-b from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-xl shadow-green-500/20"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-green-500/30 shadow-sm hover:shadow-lg",
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
                 <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {plan.name}
                  </h3>
                  {plan.name === "Free" && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold dark:bg-green-900/50 dark:text-green-400">
                      No credit card required
                    </span>
                  )}
                </div>
                
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">
                    ${priceInfo.price}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400 ml-1">
                    /month
                  </span>
                  {isAnnual && priceInfo.price > 0 && (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Billed annually (${priceInfo.price * 12}/year)
                    </div>
                  )}
                  {plan.name !== "Free" && couponCode && (
                    <p className="text-xs text-zinc-500 mt-2">
                      Use coupon code{" "}
                      <span
                        className="font-bold cursor-pointer"
                        onClick={handleCopy}
                        title="Click to copy coupon code"
                      >
                        {couponCode}
                      </span>{" "}
                      for a special discount!
                      {copied && (
                        <span className="ml-1 text-green-400">Copied!</span>
                      )}
                    </p>
                  )}

                </div>

                <div className="space-y-4">
                  {plan.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                {plan.name === "Free" ? (
                  <Button
                    onClick={loginOrRedirect}
                    variant="outline"
                    className="w-full py-6 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
                  >
                    {isCurrent ? "Current Plan" : plan.cta}
                  </Button>
                ) : (
                  <CheckoutButton
                    key={getPriceId(plan)}
                    productId={getPriceId(plan)}
                    disabled={!priceInfo.priceId || isCurrent}
                    className={cn(
                      "w-full py-6 font-semibold transition-all duration-300",
                      plan.popular
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl shadow-green-500/25 hover:shadow-green-500/40 border-0"
                        : "dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
                    )}
                  >
                    {isCurrent ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-400" /> Current
                        Plan
                      </span>
                    ) : (
                      `Upgrade to ${plan.cta}`
                    )}
                  </CheckoutButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingCard;

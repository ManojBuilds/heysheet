"use client";

import { useState } from "react";
import { Check, Star, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useLoginOrRedirect from "@/hooks/useLoginOrReditrect";
import { PLANS } from "@/lib/planLimits";
import useSubscription from "@/hooks/useSubscription";
import { CheckoutButton } from "./CheckoutButton";

const PricingCard = () => {
  const loginOrRedirect = useLoginOrRedirect();
  const { data: subscription } = useSubscription();
  const [isAnnual, setIsAnnual] = useState(
    subscription?.billing_interval === "annually",
  );

  const getPriceId = (plan: any): string =>
    plan.price[isAnnual ? "annually" : "monthly"].priceId;

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-zinc-900 dark:bg-gradient-to-br dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300 dark:bg-clip-text dark:text-transparent">
              More features, fewer costs than competitors
            </span>
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-8">
            The only form backend with Google Sheets <em>and</em> Notion integration.
            Start free with 200 submissions, upgrade when you grow.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">Compare the Competition</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-zinc-800 dark:text-zinc-200">Formspree</div>
                <div className="text-zinc-600 dark:text-zinc-400">50 free submissions, $20+/month</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-zinc-800 dark:text-zinc-200">SheetMonkey</div>
                <div className="text-zinc-600 dark:text-zinc-400">100 submissions, $20/month, no Notion</div>
              </div>
              <div className="text-center border-2 border-green-300 dark:border-green-700 rounded-lg p-2">
                <div className="font-bold text-green-700 dark:text-green-300">Heysheet</div>
                <div className="text-green-600 dark:text-green-400">200 free, $8+/month, includes Notion</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-16">
          <span
            className={cn(
              "text-sm",
              !isAnnual
                ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                : "text-zinc-500",
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
                : "text-zinc-500",
            )}
          >
            Annual{" "}
            <span className="ml-1 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">
              (Save up to $108/year)
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, index) => {
            const isCurrent =
              subscription?.plan?.toLowerCase() === plan.name.toLowerCase();

            return (
              <div
                key={index}
                className={cn(
                  "relative p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800",
                  plan.popular ? "border-green-500/50 bg-gradient-to-b from-green-50 dark:from-green-900/20 to-emerald-50 dark:to-emerald-900/20 shadow-xl shadow-green-500/20 transform scale-105" : "shadow-sm hover:shadow-lg",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="h-4 w-4 fill-current" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                {!plan.popular && plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 px-3 py-1 rounded-full text-xs font-medium">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100">
                        ${isAnnual ? plan.price.annually.price : plan.price.monthly.price}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400">/month</span>
                    </div>
                    {isAnnual && plan.originalPrice && (
                      <div className="mt-2">
                        <span className="text-sm text-zinc-500 line-through">
                          ${plan.originalPrice.annually}/year
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400 ml-2 font-medium">
                          Save ${plan.originalPrice.annualSaving}
                        </span>
                      </div>
                    )}
                    {isAnnual && plan.name !== "Free" && (
                      <div className="text-xs text-zinc-500 mt-1">
                        Billed annually (${plan.price.annually.price * 12}/year)
                      </div>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className={cn(
                          "text-zinc-700 dark:text-zinc-300",
                          i === 1 && plan.name === "Free" ? "text-green-600 dark:text-green-400 font-medium" : "",
                          feature.includes("coming soon") ? "text-blue-600 dark:text-blue-400 font-medium" : ""
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  {plan.name === "Free" ? (
                    <button
                      onClick={() => loginOrRedirect()}
                      disabled={isCurrent}
                      className={cn(buttonVariants({ variant: "outline" }), "w-full", "hover:bg-green-50 hover:border-green-300")}
                    >
                      {isCurrent ? "Current Plan" : plan.cta}
                    </button>
                  ) : (
                    <CheckoutButton
                      key={getPriceId(plan)}
                      productId={getPriceId(plan)}
                      disabled={!getPriceId(plan) || isCurrent}
                      className={cn(
                        buttonVariants({ variant: plan.popular ? "default" : "outline" }),
                        "w-full",
                        plan.popular ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" : "text-foreground"
                      )}
                    >
                      {isCurrent ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4 text-green-400" /> Current Plan
                        </span>
                      ) : (
                        plan.cta
                      )}
                    </CheckoutButton>
                  )}
                  {plan.name !== "Free" && (
                    <p className="text-center text-xs text-zinc-500 mt-2">
                      7-day free trial • No credit card required
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-zinc-700 dark:text-zinc-300">14-day free trial</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-zinc-700 dark:text-zinc-300">30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCard;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Metadata } from "next";
import { PLANS } from "@/lib/planLimits";
import { CheckoutButton } from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Checkout - Choose Your Plan | HeySheet",
  description:
    "Select the best HeySheet plan for your needs. Compare features and pricing. Upgrade anytime.",
  openGraph: {
    title: "Checkout - Choose Your Plan | HeySheet",
    description:
      "Select the best HeySheet plan for your needs. Compare features and pricing. Upgrade anytime.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    siteName: "HeySheet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout - Choose Your Plan | HeySheet",
    description:
      "Select the best HeySheet plan for your needs. Compare features and pricing. Upgrade anytime.",
  },
};

interface CheckoutPageProps {
  searchParams: Promise<{
    plan?: string;
    isAnnual?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { plan: planName, isAnnual: isAnnualString } = await searchParams;
  const isAnnual = isAnnualString === "true";

  let productId: string | undefined;
  let planDisplayName: string | undefined;

  if (planName) {
    const plan = PLANS.find(
      (p) => p.name.toLowerCase() === planName.toLowerCase(),
    );

    if (plan) {
      planDisplayName = plan.name;
      productId = isAnnual
        ? plan.price.annually.priceId
        : plan.price.monthly.priceId;
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {productId && planDisplayName ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-2xl font-bold mb-4">Confirm Your Purchase</h2>
            <p className="mb-8">
              You are about to purchase the {planDisplayName} plan.
            </p>
            <CheckoutButton productId={productId} autoOpen={true}>
              Proceed to Checkout
            </CheckoutButton>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">
              Choose a Plan
            </h1>
            <p className="text-zinc-400 mb-6">
              Pick a plan that fits your form needs. Upgrade anytime.
            </p>
            <PricingCard />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

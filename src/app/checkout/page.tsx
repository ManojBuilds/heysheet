import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Choose Your Plan | HeySheet",
  description: "Select the best HeySheet plan for your needs. Compare features and pricing. Upgrade anytime.",
  openGraph: {
    title: "Checkout - Choose Your Plan | HeySheet",
    description: "Select the best HeySheet plan for your needs. Compare features and pricing. Upgrade anytime.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    siteName: "HeySheet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout - Choose Your Plan | HeySheet",
    description: "Select the best HeySheet plan for your needs. Compare features and pricing. Upgrade anytime.",
  },
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Choose a Plan</h1>
        <p className="text-zinc-400 mb-6">
          Pick a plan that fits your form needs. Upgrade anytime.
        </p>
        <PricingCard />
      </main>
      <Footer />
    </>
  );
}

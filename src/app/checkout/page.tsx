import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";


export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10 dark:bg-zinc-950">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Choose a Plan
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Pick a plan that fits your form needs. Upgrade anytime.
        </p>
        <PricingCard />
      </main>
      <Footer />
    </>
  );
}

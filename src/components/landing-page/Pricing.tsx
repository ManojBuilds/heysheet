import PricingCard from "../PricingCard";

const Pricing = () => {
  return (
    <section id='pricing' className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
              Simple, transparent pricing
            </span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Start free, upgrade when you grow. No hidden fees, no surprises.
          </p>
        </div>
        <PricingCard />
      </div>
    </section>
  );
};

export default Pricing;

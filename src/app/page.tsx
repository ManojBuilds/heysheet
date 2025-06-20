import Navbar from "@/components/Navbar";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Pricing from "@/components/landing-page/Pricing";
import FAQ from "@/components/landing-page/FAQ";
import FinalCTA from "@/components/landing-page/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "nextjs-toploader/app";

const FinalCTA = () => {
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  const handleStartBuilding = () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    router.push("/dashboard");
  };
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="mb-8">
          <Sparkles className="h-16 w-16 mx-auto text-green-400 mb-6" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
            Start building forms that sync
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
            with Sheets — in minutes
          </span>
        </h2>

        <p className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join thousands of makers who&apos;ve ditched complex form builders for
          something that just works. Start collecting data that matters, right
          where you need it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-6 text-xl font-semibold shadow-xl shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105 border-0"
            onClick={handleStartBuilding}
          >
            Start Building Now
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>

        <p className="text-sm text-zinc-500 mt-6">
          Start building • Instant setup • Works with any Google Sheet
        </p>

        {/* Social proof */}
        <div className="mt-16 flex items-center justify-center gap-8 text-zinc-500">
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-200 mb-1">1,000+</div>
            <div className="text-sm">Forms created</div>
          </div>
          <div className="w-px h-12 bg-zinc-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-200 mb-1">50,000+</div>
            <div className="text-sm">Submissions processed</div>
          </div>
          <div className="w-px h-12 bg-zinc-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-200 mb-1">99.9%</div>
            <div className="text-sm">Uptime SLA</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

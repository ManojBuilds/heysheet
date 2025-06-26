"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DemoVideoDialog } from "./DemoVideoModal";
import useLoginOrRedirect from "@/hooks/useLoginOrReditrect";

const Hero = () => {
  const loginOrRedirect = useLoginOrRedirect()
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm mb-8 backdrop-blur-sm shadow-sm">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-semibold">
            ✨ Real-time Google Sheets sync
          </span>
        </div>

        {/* Main headline with gradient text */}
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
            Build Forms. Collect Responses.
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
            All in Google Sheets.
          </span>
          <br />
          <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
            Instantly.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-zinc-400 mb-12 max-w-xl mx-auto leading-relaxed">
          Heysheet is the easiest way to turn Google Sheets into a form backend. Create forms in minutes with drag-and-drop builder and get instant submissions—no coding required.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 text-lg font-semibold shadow-xl shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105 border-0"
            onClick={loginOrRedirect}
          >
            Start Building Forms
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <DemoVideoDialog />
        </div>

        {/* Subtext */}
        <p className="text-sm text-zinc-500">
          Start building • No setup required • Works with any Google Sheet
        </p>
      </div>
    </div>
  );
};

export default Hero;

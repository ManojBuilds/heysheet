import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
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
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
            Forms that sync with
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
            Google Sheets.
          </span>
          <br />
          <span className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
            Instantly.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          HeySheet lets you build beautiful forms that update your spreadsheets
          in real time. No complex integrations, no delays.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 text-lg font-semibold shadow-xl shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105 border-0"
          >
            Start Building Forms
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-8 py-6 text-lg transition-all duration-300 hover:border-zinc-500"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        {/* Subtext */}
        <p className="text-sm text-zinc-500">
          Start building • No setup required • Works with any Google Sheet
        </p>

        {/* Hero image placeholder */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-8 border border-zinc-700 shadow-2xl backdrop-blur-sm">
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-left space-y-3">
                <div className="h-4 bg-zinc-700 rounded w-3/4" />
                <div className="h-4 bg-zinc-700 rounded w-1/2" />
                <div className="h-4 bg-zinc-700 rounded w-2/3" />
                <div className="h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded w-32 mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

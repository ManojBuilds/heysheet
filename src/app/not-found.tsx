'use client'
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center space-y-6 p-6">
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="text-6xl font-bold text-muted-foreground/30">
            404
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-semibold text-foreground">
          Page not found
        </h1>

        {/* Error Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or navigate back to continue.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">

          <Link href="/dashboard" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Button>
        </div>

        {/* Help Section */}
        <div className="pt-8 border-t border-border/50">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Need help?
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            If you have questions or need assistance, our extensive documentation is ready for you, and you can also join
            our community Discord channel to talk to us. We're here to help!
          </p>
          <div className="flex gap-2 justify-center">

            <Link href={config.documentationUrl} target="_blank">
              Read documentation
            </Link>
            
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-xs text-muted-foreground">
          HeySheet &copy; {new Date().getFullYear()}. All rights reserved
        </div>
      </div>
    </div>
  );
}

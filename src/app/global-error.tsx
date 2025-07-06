"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center space-y-6 p-6">
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-destructive" />
                </div>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-semibold text-foreground">
              Application Error
            </h1>

            {/* Error Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              A critical error occurred and the application needs to be
              restarted. Please try refreshing the page or contact support if
              the issue persists.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={reset}
                className="w-full"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Restart Application
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Go to Homepage
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-8 text-xs text-muted-foreground">
              HeySheet © 2025. All rights reserved
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { config } from "@/config";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GlobalError from "./global-error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleGoBack = () => {
    router.back();
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center space-y-6 p-6">
        {/* Error Icon/Illustration */}
        <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-destructive" />
            </div>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>

        {/* Error Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          Please check your network connection, reload the page, or try again
          later. Contact us for assistance if the problem persists.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={reset}
            className="w-full"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try again
          </Button>

          <Button
            variant="outline"
            onClick={handleGoBack}
            className="w-full"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go back
          </Button>
        </div>

        {/* Help Section */}
        <div className="pt-8 border-t border-border/50">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Need help?
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            If you have questions or need assistance, our extensive
            documentation is ready for you, and you can also join our community
            Discord channel to talk to us. We're here to help!
          </p>
          <div className="flex gap-2 justify-center">
            <a
              href={config.documentationUrl}
              target="_blank"
              className={buttonVariants({
                variant: 'link',
                className: "text-xs h-auto p-0"
              })}

            >
              Read documentation
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-xs text-muted-foreground">
          heysheet.in. All rights reserved
        </div>
      </div>
    </div>
  );
}

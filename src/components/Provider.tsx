"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/config";

const queryClient = new QueryClient();
export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoLinkUrl: "/",
          logoPlacement: "inside",
          termsPageUrl: config.landingPageUrl + "/terms",
          privacyPageUrl: config.landingPageUrl + "/privacy-policy",
          shimmer: true,
          socialButtonsVariant: "blockButton",
          socialButtonsPlacement: "top",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  );
}

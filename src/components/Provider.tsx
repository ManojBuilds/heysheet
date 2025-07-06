"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "./PostHogProvider";
import { dark } from "@clerk/themes";
import { config } from "@/config";

const queryClient = new QueryClient();
export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
      layout: {
        logoLinkUrl: "/",
        logoPlacement: "inside",
        termsPageUrl: config.landingPageUrl +"/terms",
        privacyPageUrl: config.landingPageUrl + '/privacy-policy',
        shimmer: true,
        socialButtonsVariant: "blockButton",
        socialButtonsPlacement: "top",
      }

    }} >
      <QueryClientProvider client={queryClient}  >
        <PostHogProvider>{children}</PostHogProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

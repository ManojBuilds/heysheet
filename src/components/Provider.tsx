"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CookieConsent from "react-cookie-consent";
import { PostHogProvider } from "./PostHogProvider";
import { dark } from "@clerk/themes";

const queryClient = new QueryClient();
export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
      layout: {
        logoImageUrl: "/logo.png",
        logoLinkUrl: "/",
        logoPlacement: "inside",
        termsPageUrl: "/terms",
        privacyPageUrl: '/privacy-policy',
        shimmer: true,
        socialButtonsVariant: "blockButton",
        socialButtonsPlacement: "top",
      }

    }} >
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="heysheetCookieConsent"
        style={{
          background: "#0f0f0f",
          color: "#eaeaea",
          fontFamily: "DM Sans",
          fontSize: "14px",
          padding: "1rem 2rem",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
        }}
        buttonStyle={{
          background: "#facc15",
          color: "#0f0f0f",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "6px",
          padding: "10px 16px",
        }}
        expires={150}
      >
        We use cookies to improve your experience on Heysheet. By continuing,
        you agree to our cookie policy.
      </CookieConsent>

      <QueryClientProvider client={queryClient}  >
        <PostHogProvider>{children}</PostHogProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

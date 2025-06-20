"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CookieConsent from "react-cookie-consent";

const queryClient = new QueryClient();
export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <CookieConsent
        location="bottom"
        buttonText="Got it!"
        cookieName="myCookieConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{
          color: "#fff",
          background: "#4CAF50",
          fontSize: "13px",
        }}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>

      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  );
}

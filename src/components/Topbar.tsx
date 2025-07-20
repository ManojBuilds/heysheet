"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
// import GoogleAccountSwitcher from "./GoogleAccountSwitcher";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Logo } from "./Logo";
import { ExternalLink } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import { config } from "@/config";
import GoogleAccountSwitcher from "./GoogleAccountSwitcher";
import { Suspense } from "react";
import { ModeToggle } from "./toggle-mode";
import { useTheme } from "next-themes";
import { dark, neobrutalism } from "@clerk/themes";
// import posthog from "posthog-js";
// import { Button } from "@/components/ui/button";

export default function Topbar() {

  const { resolvedTheme } = useTheme();
  return (
    <div className="border-b h-16 flex items-center justify-between px-4 bg-background/80 backdrop-blur sticky top-0 z-20">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="sm:-mr-0 z-10" />
        <Logo />
        <SignedIn>
          <GoogleAccountSwitcher />
        </SignedIn>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={config.documentationUrl}
          className={cn(buttonVariants({ variant: "link" }), "hidden md:flex")}
          target="_blank"
        >
          <ExternalLink />
          Documentation
        </a>

        <SignedIn>
          <Link
            href={"/manage-plan"}
            className={cn(buttonVariants({ variant: "link" }), "hidden md:flex")}
          >
            Manage plan
          </Link>
          <UserButton
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : neobrutalism,
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
          />
        </SignedIn>

        <ModeToggle />
        {/* <Button */}
        {/*   onClick={() => { */}
        {/*     posthog.capture("my event", { property: "value" }); */}
        {/*   }} */}
        {/* > */}
        {/*   Track me */}
        {/* </Button> */}
      </div>
    </div>
  );
}

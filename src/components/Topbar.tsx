"use client";
import { UserButton } from "@clerk/nextjs";
import GoogleAccountSwitcher from "./GoogleAccountSwitcher";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Logo } from "./Logo";
import { ExternalLink } from "lucide-react";
// import { ModeToggle } from "./toggle-mode";
// import posthog from "posthog-js";
// import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <div className="border-b h-16 flex items-center justify-between px-4 bg-background/80 backdrop-blur sticky top-0 z-20">
      <div className="flex flex-1 gap-6 items-center">
        <Logo />
        <GoogleAccountSwitcher />
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://heysheet.mintlify.app/"
          className={buttonVariants({ variant: "link" })}
          target="_blank"
        >
          <ExternalLink />
          Documentation
        </a>

        <Link
          href={"/manage-plan"}
          className={buttonVariants({ variant: "link" })}
        >
          Manage plan
        </Link>
        <UserButton />
        {/* <ModeToggle /> */}
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

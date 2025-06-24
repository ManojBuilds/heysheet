"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Logo } from "./Logo";
// import { ModeToggle } from "./toggle-mode";
// import NewEndpointForm from "./NewEndpointFormModal";
// import { ConnectToSlackBtn } from "./connect-to-slack-button";
// import { ModeToggle } from "./toggle-mode";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b sticky top-0 z-20 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex">
            <a
              href="https://heysheet.mintlify.app/"
              className={buttonVariants({ variant: "link" })}
              target="_blank"
            >
              <ExternalLink />
              Documentation
            </a>
            <SignedIn>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "link" })}
              >
                Dashboard
              </Link>
              <Link
                href="/manage-plan"
                className={buttonVariants({ variant: "link" })}
              >
                Manage Plan
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/#features"
                className={buttonVariants({ variant: "link" })}
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className={buttonVariants({ variant: "link" })}
              >
                Pricing
              </Link>
              <SignInButton mode="modal" >
                <Button>Get Started</Button>
              </SignInButton>
            </SignedOut>
          </nav>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {/* <ModeToggle /> */}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, PlusCircle, RefreshCw, Settings } from "lucide-react";
import NewEndpointForm from "./NewEndpointFormModal";

export default function Navbar() {
  const pathname = usePathname();
  const isPaidUser = false;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="relative flex items-center">
              <RefreshCw className="h-5 w-5 text-[#0F9D58]" />{" "}
              {/* Google Sheets green color */}
            </div>
            <span className="font-heading">FormSync</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex">
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
              <Link
                href="/settings"
                className={buttonVariants({ variant: "link" })}
              >
                <Settings />
                Settings
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
              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </SignedOut>
          </nav>
          <SignedIn>
            <Link
              href={"/endpoints/new"}
              className={buttonVariants({ variant: "default" })}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create new endpoint
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

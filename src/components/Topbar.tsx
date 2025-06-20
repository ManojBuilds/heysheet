"use client";
import { UserButton } from "@clerk/nextjs";
import GoogleAccountSwitcher from "./GoogleAccountSwitcher";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Logo } from "./Logo";
// import { ModeToggle } from "./toggle-mode";

export default function Topbar() {
  return (
    <div className="border-b h-16 flex items-center justify-between px-4">
      <div className="flex flex-1 gap-6">
        <Logo />
        <div className="h-9">
          <GoogleAccountSwitcher />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://heysheet.mintlify.app/"
          className={buttonVariants({ variant: "link" })}
          target="_blank"
        >
          Docs
        </a>

        <Link
          href={"/manage-plan"}
          className={buttonVariants({ variant: "link" })}
        >
          Manage plan
        </Link>
        <UserButton />
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
}

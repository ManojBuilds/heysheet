'use client'
import Link from "next/link";
import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import useSubscription from "@/hooks/useSubscription";

const UpgradeCta = ({ className }: { className?: string, }) => {
  const { data: subscription } = useSubscription()
  return (
    <Link
      href={subscription?.plan === "free" ? "/checkout" : '/manage-plan'}
      className={buttonVariants({
        className: cn("inline-flex items-center gap-2 capitalize font-semibold", className),
        size: 'lg'
      })}
    >
      <Gem />
      {subscription && subscription?.plan !== "free"
        ? `${subscription.plan}`
        : "Start 7-Day Pro Trial"}
    </Link>
  );
};

export default UpgradeCta;

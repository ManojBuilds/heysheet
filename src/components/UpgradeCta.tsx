'use client'
import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import useSubscription from "@/hooks/useSubscription";

const UpgradeCta = ({ className }: { className?: string, }) => {
  const { data: subscription } = useSubscription()
  return (
    <Link
      href={"/checkout"}
      className={buttonVariants({
        className: cn("inline-flex items-center gap-2 capitalize", className),
      })}
    >
      <CrownIcon className="text-yellow-500" />
      {subscription && subscription?.plan !== "free"
        ? `${subscription.plan} plan`
        : "upgrad plan"}
    </Link>
  );
};

export default UpgradeCta;

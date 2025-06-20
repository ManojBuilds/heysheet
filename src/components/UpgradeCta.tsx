"use client";

import useSubscription from "@/hooks/useSubscription";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const UpgradeCta = ({ className }: { className?: string }) => {
  const { data: subscription, isLoading } = useSubscription();
  if (isLoading) return <Skeleton className="w-full h-8" />;
  return (
    <Link
      href={"/checkout"}
      className={buttonVariants({
        className: cn("inline-flex items-center gap-2 capitalize", className),
      })}
    >
      <CrownIcon className="text-yellow-500" />
      {subscription?.plan === "free" ? (
        <>Upgrade plan</>
      ) : (
        `${subscription?.plan} plan`
      )}
    </Link>
  );
};

export default UpgradeCta;

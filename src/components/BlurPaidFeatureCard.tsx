"use client";

import useSubscription from "@/hooks/useSubscription";
import { Skeleton } from "@/components/ui/skeleton";
import UpgradeCta from "./UpgradeCta";

export const BlurPaidFeatureCard = ({
  title,
  description,
  features = [],
}: {
  title: string;
  description: string;
  features?: string[];
}) => {
  const { data: subscription, isLoading, isError } = useSubscription();

  if (isError) {
    return (
      <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px] rounded-xl flex flex-col justify-center items-center text-center p-6">
        <p className="text-red-500 text-sm">
          Failed to load subscription info.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px] rounded-xl flex flex-col justify-center items-center text-center p-6 space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
        <div className="flex flex-col gap-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-52" />
          ))}
        </div>
        <Skeleton className="h-10 w-36 mt-4" />
      </div>
    );
  }

  // Don't show blur for non-free plans
  if (subscription?.plan !== "free") return null;

  return (
    <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px] rounded-xl flex flex-col justify-center items-center text-center p-6 space-y-3">
      <div className="text-left space-y-2">
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {features?.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            {features.map((feature, index) => (
              <li key={index}>
                <span className="text-green-600">✓</span> {feature}
              </li>
            ))}
          </ul>
        )}
        <UpgradeCta className="mt-4" />
      </div>
    </div>
  );
};

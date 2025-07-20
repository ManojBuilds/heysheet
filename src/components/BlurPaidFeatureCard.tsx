"use client";

import UpgradeCta from "./UpgradeCta";
import { SubscriptionData } from "@/types";

export const BlurPaidFeatureCard = ({
  title,
  description,
  features = [],
  subscription,
}: {
  title: string;
  description: string;
  features?: string[];
  subscription: SubscriptionData | undefined
}) => {

  if (subscription?.plan !== "free") return null;

  return (
    <div className="absolute inset-0 z-10 bg-background/30 backdrop-blur rounded-xl flex flex-col justify-center items-center text-center p-6 space-y-3">
      <div className="space-y-2">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {features?.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
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

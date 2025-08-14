"use client";

import { useUpgradeModalStore } from "@/stores/upgradeModalStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { CheckCircle, CrownIcon } from "lucide-react";
import Image from "next/image";
import UpgradeCta from "./UpgradeCta";
import useSubscription from "@/hooks/useSubscription";
import { PLANS } from "@/lib/planLimits";

const UpgradeModal = () => {
  const isOpen = useUpgradeModalStore((state) => state.isOpen);
  const heading = useUpgradeModalStore((state) => state.heading);
  const subHeading = useUpgradeModalStore((state) => state.subHeading);
  const updateIsOpen = useUpgradeModalStore((state) => state.updateIsOpen);
  const { data } = useSubscription();

  const proPlanFeatures =
    PLANS.find((p) => p.name === "Pro")?.features.slice(0, 3) || [];

  return (
    <Dialog open={isOpen} onOpenChange={updateIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CrownIcon className="mr-2 h-5 w-5 text-yellow-500" />
            {heading}
          </DialogTitle>
          <DialogDescription>
            {subHeading} Start your 7-day free trial to unlock more features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-8">
          <div className="h-44 w-32 mx-auto flex-shrink-0">
            <Image
              src="https://ik.imagekit.io/q3ksr5fk3/ChatGPT%20Image%20Jul%2022,%202025,%2008_11_44%20AM_5_11zon.png?updatedAt=1753152275682"
              alt="Upgrade Illustration"
              width={1024}
              height={1536}
              className="w-full h-auto"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2 text-lg">
              Unlock powerful features with Pro:
            </h3>
            <ul className="space-y-2">
              {proPlanFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
               <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>And so much more...</span>
                </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <UpgradeCta className="w-full" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;

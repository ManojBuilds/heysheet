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
import { CrownIcon } from "lucide-react";
import Image from "next/image";
import UpgradeCta from "./UpgradeCta";
import useSubscription from "@/hooks/useSubscription";

const UpgradeModal = () => {
  const isOpen = useUpgradeModalStore((state) => state.isOpen);
  const heading = useUpgradeModalStore((state) => state.heading);
  const subHeading = useUpgradeModalStore((state) => state.subHeading);
  const updateIsOpen = useUpgradeModalStore((state) => state.updateIsOpen);
  const {data} = useSubscription()

  return (
    <Dialog open={isOpen} onOpenChange={updateIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CrownIcon className="mr-2 h-5 w-5 text-yellow-500" />
            {heading}
          </DialogTitle>
          <DialogDescription>{subHeading}</DialogDescription>
        </DialogHeader>
        <div className="h-44 w-32 mx-auto">
          <Image src="https://ik.imagekit.io/q3ksr5fk3/ChatGPT%20Image%20Jul%2022,%202025,%2008_11_44%20AM_5_11zon.png?updatedAt=1753152275682" alt="Upgrade Illustration" width={1024} height={1536} className="w-full h-auto" />
        </div>
        <DialogFooter>
          <UpgradeCta className="w-full" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;

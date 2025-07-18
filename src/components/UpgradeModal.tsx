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

const UpgradeModal = () => {
  const isOpen = useUpgradeModalStore((state) => state.isOpen);
  const heading = useUpgradeModalStore((state) => state.heading);
  const subHeading = useUpgradeModalStore((state) => state.subHeading);
  const updateIsOpen = useUpgradeModalStore((state) => state.updateIsOpen);

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
          <Image src="https://ik.imagekit.io/q3ksr5fk3/upgrade.png" alt="Upgrade Illustration" width={1024} height={1536} className="w-full h-auto" />
        </div>
        <DialogFooter>
          <UpgradeCta />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;

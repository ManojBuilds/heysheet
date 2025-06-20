"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

interface IntegrationCardProps {
  title: string;
  isConnected: boolean;
  iconImgSrc: string;
  handleAction: () => void;
  isLoading: boolean;
}

const IntegrationCard = ({
  title = "Google Sheets",
  isConnected,
  iconImgSrc = "/slack.png",
  handleAction,
  isLoading,
}: IntegrationCardProps) => {
  return (
    <div className="p-4 sm:p-6 rounded-md border max-w-xl">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-12 p-2 bg-muted aspect-square rounded-full border grid place-items-center overflow-hidden">
            <Image
              src={iconImgSrc}
              alt={title}
              width={100}
              height={100}
              className="w-full h-full"
            />
          </div>
          <h3 className="">{title}</h3>
        </div>
        <Button
          leftIcon={isLoading && <Loader2Icon className="animate-spin" />}
          variant={"secondary"}
          onClick={handleAction}
          disabled={isLoading}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
};

export default IntegrationCard;

"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";

export const CopyToClipboard = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
  };
  return (
    <TooltipWrapper content="Copy">
      <Button
        onClick={copyToClipboard}
        variant={"secondary"}
        className={className}
        size={"icon"}
      >
        {copied ? (
          <CheckIcon className="w-4 h-4 text-green-500" />
        ) : (
          <ClipboardIcon className="w-4 h-4" />
        )}
      </Button>
    </TooltipWrapper>
  );
};

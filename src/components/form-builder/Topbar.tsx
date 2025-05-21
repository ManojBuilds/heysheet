import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, FileIcon } from "lucide-react";

const Topbar = () => {
  return (
    <header className="flex items-center justify-between py-3">
      {/* Left: Logo */}
      <div className="flex items-center">
        <span className="font-bold text-lg">HeySheet</span>
      </div>
      {/* Right: Preview, Confirm, Save */}
      <div className="flex items-center gap-3">
        <Button variant={"outline"}>
          <Eye />
          Preview
        </Button>
        <Button>
          <FileIcon />
          Save & Confirm
        </Button>
      </div>
    </header>
  );
};

export default Topbar;

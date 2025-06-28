"use client";
import { Plus } from "lucide-react";
import GoogleSheetLogo from "./GoogleSheetLogo";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { getGoogleConnectUrl } from "@/actions";

const AllowGooglePermissions = ({ className }: { className?: string }) => {
  const handleClick = async () => {
    const url = await getGoogleConnectUrl();
    if (url) {
      window.location.href = url;
    }
  };
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center max-w-lg mx-auto text-center",
        className,
      )}
    >
      <GoogleSheetLogo className="mx-auto" />
      <p>
        To get started, connect your <b>Google Sheets account</b>.
      </p>
      <button
        className={buttonVariants({ className: "mt-4" })}
        onClick={handleClick}
      >
        <Plus className="mr-2 h-4 w-4" />
        Connect Google Account
      </button>
    </div>
  );
};

export default AllowGooglePermissions;

import { Plus } from "lucide-react";
import GoogleSheetLogo from "./GoogleSheetLogo";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const AllowGooglePermissions = ({
  url,
  className,
}: {
  url: string;
  className?: string;
}) => {
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
      <a className={buttonVariants({ className: "mt-4" })} href={url}>
        <Plus className="mr-2 h-4 w-4" />
        Connect Google Account
      </a>
    </div>
  );
};

export default AllowGooglePermissions;

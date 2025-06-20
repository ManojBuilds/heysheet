import { Plus } from "lucide-react";
import GoogleSheetLogo from "./GoogleSheetLogo";
import { buttonVariants } from "./ui/button";

const AllowGooglePermissions = ({url}: {url: string}) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-lg mx-auto text-center">
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

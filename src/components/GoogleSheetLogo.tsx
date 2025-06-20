import { cn } from "@/lib/utils";
import Image from "next/image";

const GoogleSheetLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/google_sheet.svg"
      alt="Google Logo"
      width={100}
      height={100}
      className={cn(className, "mb-4 w-12")}
    />
  );
};
export default GoogleSheetLogo;

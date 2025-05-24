import { FormData } from "@/types/form-builder";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const Branding = ({ formData }: { formData: FormData }) => {
  return (
    <div className="flex-shrink-0 w-fit mx-auto">
      <Link
        href={"/"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style={{
          backgroundColor: formData.theme.backgroundSecondary,
          border: `1px solid ${formData.theme.borderColor}`,
        }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: formData.theme.textColorSecondary }}
        >
          Create forms like this with
        </span>
        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ color: formData.theme.primaryColor }}
        >
          HeySheet
         <ExternalLink className="w-5 h-5"/> 
        </div>
      </Link>
    </div>
  );
};

export default Branding;

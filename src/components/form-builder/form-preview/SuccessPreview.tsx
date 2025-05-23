import { FormData } from "@/types/form-builder";
import { Check, PartyPopper } from "lucide-react";
import Branding from "./Branding";

const SuccessPreview = ({ formData }: { formData: FormData }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: formData.theme.backgroundColor,
        color: formData.theme.textColor,
      }}
    >
      <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full rounded-lg text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: formData.theme.primaryColor + "20" }}
        >
          <PartyPopper
            className="w-8 h-8"
            style={{ color: formData.theme.primaryColor }}
          />
        </div>

        <h1
          className="text-2xl font-semibold"
          style={{ color: formData.theme.textColor }}
        >
          Thanks for your submission!
        </h1>

        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: formData.theme.textColorSecondary }}
        >
          <Check className="w-4 h-4" />
          <p>Your response has been recorded successfully</p>
        </div>
      </div>
      <Branding formData={formData} />
    </div>
  );
};

export default SuccessPreview;

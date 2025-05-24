import { FormData } from "@/types/form-builder";
import { Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Branding from "./Branding";

interface SuccessPreviewProps {
  formData: FormData;
}

const SuccessPreview: React.FC<SuccessPreviewProps> = ({ formData }) => {
  const successPage = formData.successPage || {
    title: "Thanks for your submission!",
    description: "Your response has been recorded.",
  };

  return (
    <div
      className="min-h-svh flex flex-col items-center justify-center p-6"
      style={{
        backgroundColor: formData.theme.backgroundColor,
        color: formData.theme.textColor,
      }}
    >
      <div className="max-w-2xl w-full text-center space-y-6 mb-6">
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
          style={{ backgroundColor: formData.theme.primaryColor + "20" }}
        >
          <Check
            className="w-8 h-8"
            style={{ color: formData.theme.primaryColor }}
          />
        </div>

        <h1
          className="text-3xl font-semibold"
          style={{ color: formData.theme.textColor }}
        >
          {successPage.title}
        </h1>

        <p
          className="text-lg"
          style={{ color: formData.theme.textColorSecondary }}
        >
          {successPage.description}
        </p>
        {successPage.customContent && (
          <div
            className="mt-8 p-6 rounded-lg text-left prose prose-sm max-w-none"
            style={
              {
                backgroundColor: formData.theme.backgroundSecondary + "20",
                border: `1px solid ${formData.theme.borderColor}`,
                "--tw-prose-body": formData.theme.textColorSecondary,
                "--tw-prose-headings": formData.theme.textColor,
                "--tw-prose-links": formData.theme.primaryColor,
              } as React.CSSProperties & Record<string, any>
            }
            dangerouslySetInnerHTML={{ __html: successPage.customContent }}
          />
        )}
      </div>

      <Branding formData={formData} />
    </div>
  );
};

export default SuccessPreview;

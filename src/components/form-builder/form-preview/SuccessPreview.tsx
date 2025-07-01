"use client";

import { FormData } from "@/types/form-builder";
import Branding from "./Branding";
import successAnimation from "@/animations/success_checkmark.json";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface SuccessPreviewProps {
  formData: FormData;
  redirectUrl: string | null;
}

function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const SuccessPreview: React.FC<SuccessPreviewProps> = ({
  formData,
  redirectUrl,
}) => {
  const [timer, setTimer] = useState(5000);
  const theme = formData.theme;

  const successPage = formData.successPage || {
    title: "Submission Successful!",
    description: "We've received your response. Thank you!",
  };

  useEffect(() => {
    if (!redirectUrl || timer <= 0) return;

    const countdown = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 1 && redirectUrl) {
      window.location.href = redirectUrl;
    }

    return () => clearTimeout(countdown);
  }, [timer, redirectUrl]);
  console.log("success page", successPage);

  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-12"
      style={{
        color: theme.text,
        fontFamily: theme.font,
      }}
    >
      <div className="w-full max-w-xl text-center">
        {/* Animation */}
        <div className="w-24 md:w-32 mx-auto mb-4">
          <Lottie animationData={successAnimation} loop={false} autoplay />
        </div>

        {/* Title */}
        <h1
          className="text-2xl md:text-3xl font-semibold mb-1"
          style={{ color: theme.text }}
        >
          {successPage.title || "Thanks for your submission"}
        </h1>

        {/* Description */}
        <p
          className="text-base md:text-lg mb-6"
          style={{ color: theme.textSecondary }}
        >
          {successPage.description || "Your submission has been recorded."}
        </p>

        {successPage.customContent &&
          stripHtml(successPage.customContent).trim() !== "" && (
            <div
              className="text-left border border-dashed p-4 rounded-lg prose prose-sm mt-4"
              style={
                {
                  "--tw-prose-body": theme.textSecondary,
                  "--tw-prose-headings": theme.text,
                  "--tw-prose-links": theme.primary,
                  "--tw-prose-bold": theme.text,
                  borderColor: theme.border,
                  background: theme.backgroundSecondary,
                  borderRadius: theme.radius,
                } as React.CSSProperties & Record<string, any>
              }
              dangerouslySetInnerHTML={{ __html: successPage.customContent }}
            />
          )}

        {/* Redirect Message */}
        
        
      </div>
    </div>
  );
};

export default SuccessPreview;

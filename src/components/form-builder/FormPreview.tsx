"use client";
import React, { useState, useMemo } from "react";
import {
  FormComponent,
  FormData as IFormData
} from "@/types/form-builder";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "./form-preview/FormField";
import SuccessPreview from "./form-preview/SuccessPreview";
import { getZodSchemasByPage } from "@/lib/form-preview";
import Branding from "./form-preview/Branding";

type FormValues = Record<string, any>;

interface FormPreviewProps {
  formData: IFormData;
  onClose?: () => void;
  endpoint: string;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  formData,
  onClose,
  endpoint,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allFormData, setAllFormData] = useState<FormValues>({});

  const schemas = useMemo(
    () => getZodSchemasByPage(formData.pages, formData.components),
    [formData.pages, formData.components]
  );

  const currentPageId = formData.pages[currentPageIndex]?.id;
  const methods = useForm<any>({
    resolver: zodResolver(schemas[currentPageId] as any),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: allFormData,
  });

  const {
    handleSubmit,
    formState: {  errors },
  } = methods;

  const pageComponents = useMemo(() => {
    const pages: FormComponent[][] = [];
    formData.pages.forEach((page) => {
      const componentsInPage = formData.components.filter(
        (comp) => comp.pageId === page.id
      );
      if (componentsInPage.length > 0) {
        pages.push(componentsInPage);
      }
    });
    return pages.length ? pages : [formData.components];
  }, [formData.pages, formData.components]);

  const currentPageComponents = pageComponents[currentPageIndex] || [];
  const isLastPage = currentPageIndex === pageComponents.length - 1;

  const handleConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const onSubmit = async (data: FormValues) => {
    const mergedData = { ...allFormData, ...data };
    const flattenedData: Record<string, any> = {};

    for (const key in mergedData) {
      const value = mergedData[key];
      if (Array.isArray(value)) {
        flattenedData[key] = value.join(",");
      } else if (typeof value === "object" && value !== null) {
        flattenedData[key] = Object.values(value).join(",");
      } else {
        flattenedData[key] = value;
      }
    }

    setAllFormData(flattenedData);

    if (!isLastPage) {
      setCurrentPageIndex((prev) => prev + 1);
      methods.reset({});
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/submit/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "heysheet-api-key": process.env.NEXT_PUBLIC_HEYSHEET_API_KEY || "",
        },
        body: JSON.stringify(flattenedData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      if (responseData.success) {
        handleConfetti();
        setHasSubmitted(true);
      } else {
        throw new Error(responseData.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  if (!hasSubmitted) {
    return <SuccessPreview formData={formData} />;
  }

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{
        backgroundColor: formData.theme.backgroundColor,
        color: formData.theme.textColor,
      }}
    >
      <div className="flex-1 p-6">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-3xl mx-auto mt-12 rounded-lg p-8"
          >
            <div className="space-y-8">
              {currentPageComponents.map((component) => (
                <FormField
                  key={component.id}
                  component={component}
                  theme={formData.theme}
                />
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPageIndex === 0}
                className="transition-colors hover:opacity-90"
                style={{
                  backgroundColor: formData.theme.backgroundColor,
                  borderColor: formData.theme.borderColor,
                  color: formData.theme.textColor,
                }}
              >
                Previous
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className="transition-colors hover:opacity-90 flex items-center gap-2"
                style={{
                  backgroundColor: formData.theme.primaryColor,
                  color: "#fff",
                  border: "none",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submit
                  </>
                ) : isLastPage ? (
                  "Submit"
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm"
                  style={{ color: formData.theme.textColorSecondary }}
                >
                  Page {currentPageIndex + 1} of {pageComponents.length}
                </span>
              </div>
              <div
                className="w-full h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: formData.theme.borderColor }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentPageIndex + 1) / pageComponents.length) * 100
                    }%`,
                    backgroundColor: formData.theme.primaryColor,
                  }}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      <Branding formData={formData} />
    </div>
  );
};

export default FormPreview;

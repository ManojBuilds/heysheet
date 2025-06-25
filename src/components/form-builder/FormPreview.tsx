"use client";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FormComponent, FormData as IFormData } from "@/types/form-builder";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, EyeOff, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "./form-preview/FormField";
import { getZodSchemasByPage } from "@/lib/form-preview";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const SuccessPreview = dynamic(() => import("./form-preview/SuccessPreview"));
const Branding = dynamic(() => import("./form-preview/Branding"));

type FormValues = Record<string, any>;

interface FormPreviewProps {
  formData: IFormData;
  onClose?: () => void;
  className?: string;
  formId: string;
  redirectUrl: string | null;
  showSuccessPreview?: boolean;
}

export const handleConfetti = () => {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

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

const FormPreview: React.FC<FormPreviewProps> = ({
  formData,
  onClose,
  className,
  formId,
  redirectUrl,
  showSuccessPreview,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState("");
  const [fullFormData, setFullFormData] = useState<FormValues>({});
  const router = useRouter();

  const schemas = useMemo(
    () => getZodSchemasByPage(formData.pages, formData.components),
    [formData.pages, formData.components],
  );
  const currentPageId = formData.pages[currentPageIndex]?.id;
  const methods = useForm<any>({
    resolver: zodResolver(schemas[currentPageId] as any),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { handleSubmit, formState: { errors } } = methods;

  const pageComponents = useMemo(() => {
    const pages: FormComponent[][] = [];
    formData.pages.forEach((page) => {
      const componentsInPage = formData.components.filter(
        (comp) => comp.pageId === page.id,
      );
      if (componentsInPage.length > 0) {
        pages.push(componentsInPage);
      }
    });
    return pages.length ? pages : [formData.components];
  }, [formData.pages, formData.components]);

  const currentPageComponents = useMemo(
    () => pageComponents[currentPageIndex] || [],
    [pageComponents, currentPageIndex],
  );
  const isLastPage = currentPageIndex === pageComponents.length - 1;
  const isMultiPage = pageComponents.length > 1;

  const onSubmit = useCallback(async (data: FormValues) => {
    const mergedData = { ...fullFormData, ...data };
    const formDataObj = new FormData();
    for (const key in mergedData) {
      const value = mergedData[key];
      if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file) => {
          formDataObj.append(key, file);
        });
      } else {
        formDataObj.append(key, value);
      }
    }
    if (!isLastPage) {
      setCurrentPageIndex((prev) => prev + 1);
      setFullFormData((prev) => ({ ...prev, ...data }));
      methods.reset({});
      return;
    }
    setIsSubmitting(true);
    setSubscriptionError("");
    try {
      const response = await fetch(`/api/s/${formId}`, {
        method: "POST",
        body: formDataObj,
      });
      const responseData = await response.json();
      if (!response.ok || !responseData.success) {
        setSubscriptionError(responseData.message);
        throw new Error(responseData.message || "Submission failed");
      }
      handleConfetti();
      setHasSubmitted(true);
    } catch (error) {
      // Optionally show a toast here
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [fullFormData, isLastPage, formId, methods]);

  useEffect(() => {
    if (formData.theme.font) {
      const fontHref = `https://fonts.googleapis.com/css2?family=${formData.theme.font.replace(/ /g, "+")}&display=swap`;
      if (!document.querySelector(`link[href='${fontHref}']`)) {
        const link = document.createElement("link");
        link.href = fontHref;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    }
  }, [formData.theme.font]);

  const handlePrevious = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  }, [currentPageIndex]);

  const theme = useMemo(() => formData.theme, [formData.theme]);

  if (hasSubmitted || showSuccessPreview) {
    return <SuccessPreview formData={formData} redirectUrl={redirectUrl} />;
  }

  if (currentPageComponents.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <EyeOff className="w-12 h-12 mb-4" />
        <h1 className="text-2xl font-semibold  mb-2">Nothing to preview</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          You haven’t added any form components yet. Start building your form to
          preview it.
        </p>
        <Button onClick={onClose}>Go Back</Button>
      </div>
    );

  return (
    <div
      className={cn("flex flex-col min-h-screen relative p-4 gap-6", className)}
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        borderRadius: theme.radius,
        fontFamily: theme.font,
      }}
    >
      <div className="space-y-2">
        {subscriptionError ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center text-red-800">
            <AlertTriangle className="w-10 h-10 mb-3 text-red-500" />
            <h2 className="text-xl font-semibold mb-1">Form unavailable</h2>
            <p className="text-sm mb-4">
              This form has reached its limit. Please contact the form owner.
            </p>
            <Button
              onClick={() => router.back()}
              variant="outline"
              leftIcon={<ArrowLeft />}
            >
              Go Back
            </Button>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-3xl mx-auto rounded-lg"
            >
              <div className="mb-6">
                {currentPageComponents
                  .filter((component) =>
                    ["heading", "subheading", "paragraph"].includes(
                      component.type,
                    ),
                  )
                  .map((component) => (
                    <FormField
                      key={component.id}
                      component={component}
                      theme={theme}
                      formId={formId}
                    />
                  ))}
              </div>

              <div className="space-y-4">
                {currentPageComponents
                  .filter(
                    (component) =>
                      !["heading", "subheading", "paragraph"].includes(
                        component.type,
                      ),
                  )
                  .map((component) => (
                    <div
                      style={{ backgroundColor: theme.backgroundSecondary }}
                      className="p-4 rounded-sm"
                      key={component.id}
                    >
                      <FormField
                        component={component}
                        theme={theme}
                        formId={formId}
                      />
                    </div>
                  ))}
              </div>

              <div className="flex justify-between mt-8">
                {isMultiPage ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentPageIndex === 0}
                    className="transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="transition-colors hover:opacity-90 flex items-center gap-2"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryForeground,
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

              {isMultiPage && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Page {currentPageIndex + 1} of {pageComponents.length}
                    </span>
                  </div>
                  <div
                    className="w-full h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: theme.border }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${((currentPageIndex + 1) / pageComponents.length) * 100
                          }%`,
                        backgroundColor: theme.primary,
                      }}
                    />
                  </div>
                </div>
              )}
            </form>
          </FormProvider>
        )}
      </div>

      <Branding formData={formData} />
    </div>
  );
};

export default FormPreview;

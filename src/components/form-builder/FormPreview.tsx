"use client";
import dynamic from "next/dynamic";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FormComponent, FormData as IFormData } from "@/types/form-builder";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CornerDownLeft,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "./form-preview/FormField";
import { getZodSchemaForComponent } from "@/lib/form-preview";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { geistMono } from "../ui/fonts";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";

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
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState("");
  const [fullFormData, setFullFormData] = useState<Record<string, FormValues>>(
    {},
  );
  const [showIntro, setShowIntro] = useState(true);
  const router = useRouter();

  const allComponents = useMemo(
    () => formData.components.filter((c) => c.type),
    [formData.components],
  );

  const currentComponent = useMemo(
    () => allComponents[currentComponentIndex],
    [allComponents, currentComponentIndex],
  );

  const methods = useForm<any>({
    resolver: zodResolver(getZodSchemaForComponent(currentComponent)),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { handleSubmit } = methods;

  useEffect(() => {
    if (currentComponent) {
      methods.reset(fullFormData[currentComponent.id] || {});
    }
  }, [currentComponent, fullFormData, methods]);

  const isLastComponent = currentComponentIndex === allComponents.length - 1;

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setFullFormData((prev) => ({
        ...prev,
        [currentComponent.id]: data,
      }));

      if (!isLastComponent) {
        setCurrentComponentIndex((prev) => prev + 1);
        return;
      }

      setIsSubmitting(true);
      setSubscriptionError("");
      try {
        const formDataObj = new FormData();
        const finalData = {
          ...Object.values(fullFormData).reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {},
          ),
          ...data,
        };

        for (const key in finalData) {
          const value = finalData[key];
          if (Array.isArray(value) && value[0] instanceof File) {
            value.forEach((file) => formDataObj.append(key, file));
          } else {
            formDataObj.append(key, value);
          }
        }

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
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fullFormData, isLastComponent, formId, methods],
  );

  const handleNext = useCallback(async () => {
    await handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const handlePrevious = useCallback(() => {
    if (currentComponentIndex > 0) {
      setFullFormData((prev) => ({
        ...prev,
        [currentComponent.id]: methods.getValues(),
      }));
      setCurrentComponentIndex((prev) => prev - 1);
    }
  }, [currentComponentIndex, currentComponent, methods]);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.ctrlKey) {
        if (showIntro) {
          setShowIntro(false);
          return;
        }
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === "TEXTAREA") {
          return;
        }
        event.preventDefault();
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, showIntro]);

  const theme = useMemo(() => formData.theme, [formData.theme]);

  if (allComponents.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <EyeOff className="w-12 h-12 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Nothing to preview</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          You haven’t added any form components yet. Start building your form to
          preview it.
        </p>
        <Button onClick={onClose}>Go Back</Button>
      </div>
    );

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen relative overflow-hidden",
        className,
      )}
      style={{
        color: theme.text,
        fontFamily: theme.font,
        backgroundColor: theme.background,
      }}
    >
      {/* Background Image with Blur */}
      {/* <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          <Image
            src="/form-bg.png"
            className="w-full h-full"
            quality={100}
            alt="form background"
            fill
          />
        </div>
      </div> */}

      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <div className="absolute top-0 left-0 w-full h-1.5">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${
                ((currentComponentIndex + 1) / allComponents.length) * 100
              }%`,
              backgroundColor: theme.primary,
            }}
          />
        </div>
        {/* <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30"> */}
        {/*   <div className="relative w-16 h-16 rounded-xl overflow-hidden backdrop-blur-xl bg-white/30 flex items-center justify-center"> */}
        {/*     <Image */}
        {/*       src="/logo.png" */}
        {/*       alt="Logo" */}
        {/*       quality={100} */}
        {/*       className="object-contain scale-200 w-full h-full" */}
        {/*       fill */}
        {/*     /> */}
        {/*   </div> */}
        {/* </div> */}

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          {showIntro ? (
            <div className="flex flex-col items-center justify-center text-center">
              <h1
                className="text-4xl font-bold mb-4"
                style={{ color: theme.text }}
              >
                {formData.title || "Form Preview"}
              </h1>
              <p
                className="text-lg mb-8 flex items-center"
                style={{ color: theme.textSecondary }}
              >
                <Clock className="w-4 h-4 inline-block mr-1" />
                Takes {Math.ceil(allComponents.length * 0.5)} minutes
              </p>
              <Button
                onClick={() => setShowIntro(false)}
                className="transition-colors hover:opacity-90 flex items-center gap-2"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                  border: "none",
                }}
                rightIcon={<ArrowRight size={18} strokeWidth={1.5} />}
              >
                Get Started
              </Button>
            </div>
          ) : hasSubmitted || showSuccessPreview ? (
            <SuccessPreview formData={formData} redirectUrl={redirectUrl} />
          ) : subscriptionError ? (
            <div className="flex flex-col items-center justify-center text-center text-red-800">
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
                onSubmit={(e) => e.preventDefault()}
                className="w-full max-w-2xl text-left text-2xl"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentComponent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FormField
                      component={currentComponent}
                      theme={theme}
                      formId={formId}
                    />
                    {!isLastComponent && (
                      <p
                        className={cn(
                          "text-sm mt-2 flex items-end justify-end gap-2",
                          geistMono.className,
                        )}
                        style={{ color: theme.textSecondary }}
                      >
                        press <strong>Ctrl + Enter</strong>
                        <CornerDownLeft size={14} strokeWidth={1.5} />
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
            </FormProvider>
          )}
        </main>

        {!showSuccessPreview && !showIntro && !hasSubmitted && (
          <footer className="flex-shrink-0 p-4">
            <div className="flex justify-end items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentComponentIndex === 0}
                className="transition-colors hover:opacity-90"
                style={{
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.text,
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="transition-colors hover:opacity-90 flex items-center gap-2"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryForeground,
                    border: "none",
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isLastComponent ? (
                    "Submit"
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </footer>
        )}
        <div className="mt-4">
          <Branding formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default FormPreview;

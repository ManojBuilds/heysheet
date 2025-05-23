"use client";
import React, { useState, useMemo } from "react";
import {
  FormComponent,
  FormData as IFormData,
  FormTheme,
  FormPage,
} from "@/types/form-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Star, Check, PartyPopper, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = Record<string, any>;

export const getZodSchemasByPage = (
  pages: FormPage[],
  fields: FormComponent[]
): Record<string, z.ZodObject<any>> => {
  const result: Record<string, z.ZodObject<any>> = {};

  for (const page of pages) {
    const pageFields = fields.filter((f) => f.pageId === page.id);
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const field of pageFields) {
      const { name, type, title, required, properties } = field;
      let schema: z.ZodTypeAny;

      switch (type) {
        case "short-text":
        case "long-text":
          schema = required
            ? z.string().min(1, `${title} is required`)
            : z.string().optional();
          break;

        case "email":
          schema = required
            ? z.string().email("Invalid email")
            : z.string().email().optional();
          break;

        case "phone":
          schema = required
            ? z.string().regex(/^[\d\-\+\(\) ]+$/, "Invalid phone number")
            : z
                .string()
                .regex(/^[\d\-\+\(\) ]+$/)
                .optional();
          break;

        case "number": {
          let s = z.number({ invalid_type_error: `${title} must be a number` });
          if (properties.min !== undefined) s = s.min(properties.min);
          if (properties.max !== undefined) s = s.max(properties.max);
          schema = required ? s : s.optional();
          break;
        }

        case "date":
          schema = required
            ? z
                .string()
                .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
            : z.string().optional();
          break;

        case "rating": {
          let s = z
            .number()
            .min(1, "Minimum rating is 1")
            .max(properties.maxRating, `Max rating is ${properties.maxRating}`);
          schema = required ? s : s.optional();
          break;
        }

        case "single-choice":
        case "dropdown": {
          const opts = properties.options;
          schema = required
            ? z.enum([...opts] as [string, ...string[]])
            : z.enum([...opts] as [string, ...string[]]).optional();
          break;
        }

        case "multiple-choice": {
          const opts = properties.options;
          schema = required
            ? z.array(z.enum([...opts] as [string, ...string[]])).min(1)
            : z.array(z.enum([...opts] as [string, ...string[]])).optional();
          break;
        }

        default:
          schema = z.any();
      }

      shape[name] = schema;
    }

    result[page.id] = z.object(shape);
  }

  return result;
};

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
    reValidateMode: 'onChange',
    defaultValues: allFormData
  });

  const {
    handleSubmit,
    formState: { isValid, errors },
  } = methods;

  console.log({ errors });

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

  const Branding = () => (
    <div className="flex-shrink-0">
      <Link
        href={"/"}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style={{
          backgroundColor: formData.theme.backgroundSecondary,
          border: `1px solid ${formData.theme.borderColor}`,
        }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: formData.theme.textColorSecondary }}
        >
          Made with
        </span>
        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ color: formData.theme.primaryColor }}
        >
          HeySheet
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform group-hover:translate-x-1"
          >
            <path
              d="M13.5 6H5.25C4.65326 6 4.08097 6.23705 3.65901 6.65901C3.23705 7.08097 3 7.65326 3 8.25V18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H15.75C16.3467 21 16.919 20.7629 17.341 20.341C17.7629 19.919 18 19.3467 18 18.75V10.5M7.5 16.5L21 3M21 3H15.75M21 3V8.25"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </div>
  );

  if (hasSubmitted) {
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
        <Branding />
      </div>
    );
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
                disabled={isSubmitting || (Object.keys(errors).length > 0) }
                className="transition-colors hover:opacity-90 flex items-center gap-2"
                style={{
                  backgroundColor: formData.theme.primaryColor,
                  color: "#fff",
                  border: "none",
                }}
              >
                {isSubmitting ? (
                  <>
                  <Loader2 className="w-5 h-5 animate-spin"/>
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
      <Branding />
    </div>
  );
};

const FormField = React.memo(
  ({ component, theme }: { component: FormComponent; theme: FormTheme }) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    return (
      <div className="space-y-3">
        <div>
          <h3
            className="text-base font-medium mb-1"
            style={{ color: theme.textColor }}
          >
            {component.title}
            {component.required && (
              <span className="ml-1" style={{ color: theme.errorColor }}>
                *
              </span>
            )}
          </h3>
          {component.description && (
            <p className="text-sm" style={{ color: theme.textColorSecondary }}>
              {component.description}
            </p>
          )}
        </div>
        {renderComponentInput(component, theme, register)}
        {errors[component.name] && (
          <p className="text-sm mt-1" style={{ color: theme.errorColor }}>
            {errors[component.name]?.message as string}
          </p>
        )}
      </div>
    );
  }
);

function renderComponentInput(
  component: FormComponent,
  theme: FormTheme,
  register: any
) {
  const inputStyles = {
    backgroundColor: "transparent",
    border: `1px solid ${theme.borderColor}`,
    color: theme.textColor,
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
  };

  switch (component.type) {
    case "short-text":
      return (
        <Input
          type="text"
          {...component.properties}
          {...register(component.name)}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
        />
      );
    case "email":
      return (
        <Input
          type="email"
          {...component.properties}
          {...register(component.name)}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
        />
      );
    case "phone":
      return (
        <Input
          type="tel"
          {...component.properties}
          {...register(component.name)}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          {...component.properties}
          {...register(component.name, {
            valueAsNumber: true,
            min: component.properties.min,
            max: component.properties.max,
          })}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          {...component.properties}
          {...register(component.name, {
            setValueAs: (value: string) =>
              value ? new Date(value).toISOString().split("T")[0] : "",
          })}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
        />
      );

    case "long-text":
      return (
        <Textarea
          {...component.properties}
          {...register(component.name)}
          className="min-h-[120px] focus:ring-2"
          style={inputStyles}
        />
      );

    case "multiple-choice":
      return (
        <div className="space-y-3">
          {component.properties.options?.map((option: string, i: number) => (
            <label key={i} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option}
                {...register(component.name)}
                className="accent-primary"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    case "single-choice":
      return (
        <div className="space-y-3">
          {component.properties.options?.map((option: string, i: number) => (
            <label key={i} className="flex items-center space-x-2">
              <input
                type="radio"
                value={option}
                {...register(component.name)}
                className="accent-primary"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );

    case "dropdown":
      return (
        <select
          {...register(component.name)}
          className="w-full p-2 rounded border"
          style={inputStyles}
          defaultValue=""
        >
          <option value="" disabled>
            Select an option
          </option>
          {component.properties.options?.map((option: string, i: number) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "rating": {
      const { watch, setValue, trigger } = useFormContext();
      const ratingValue = watch(component.name);

      return (
        <div className="flex gap-2">
          {Array.from({ length: component.properties.maxRating || 5 }).map(
            (_, i) => (
              <label key={i} className="cursor-pointer">
                <input
                  type="radio"
                  value={i + 1}
                  {...register(component.name, {
                    valueAsNumber: true,
                    onChange: ( )=>{
                    trigger(component.name);}
                  })}
                  className="hidden"
                  checked={Number(ratingValue) === i + 1}
                />
                <Star
                  className="h-6 w-6 transition-colors"
                  style={{
                    color: "#FFD700",
                  }}
                  fill={Number(ratingValue) > i ? "#FFD700" : "none"}
                  strokeWidth={1.5}
                  onClick={() => setValue(component.name, i + 1, {
                    shouldValidate: true
                  })}
                />
              </label>
            )
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

export default FormPreview;

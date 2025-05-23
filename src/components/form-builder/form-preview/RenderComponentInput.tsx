"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormComponent, FormTheme } from "@/types/form-builder";
import { Star } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function RenderComponentInput({
  component,
  theme,
  register,
}: {
  component: FormComponent;
  theme: FormTheme;
  register: any;
}) {
  const { watch, setValue, trigger } = useFormContext();

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
                    onChange: () => {
                      trigger(component.name);
                    },
                  })}
                  className="hidden"
                  checked={Number(ratingValue) === i + 1}
                />
                <Star
                  className="h-6 w-6 transition-colors"
                  style={{
                    color: theme.accentColor,
                  }}
                  fill={Number(ratingValue) > i ? theme.accentColor : "none"}
                  strokeWidth={1.5}
                  onClick={() =>
                    setValue(component.name, i + 1, {
                      shouldValidate: true,
                    })
                  }
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

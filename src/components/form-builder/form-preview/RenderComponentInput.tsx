"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormComponent,
  FormComponentType,
  FormTheme,
} from "@/types/form-builder";
import { Star, Upload, CalendarIcon, Link } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "../form-components/phone-number";
import FileUpload from "../form-components/file-upload";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AddressComponent } from "../form-components/address";

export function getDefaultProperties(type: FormComponentType) {
  switch (type) {
    case "short-text":
    case "long-text":
      return { placeholder: "Enter your answer" };
    case "number":
      return { min: 0, max: 100, placeholder: "Enter a number" };
    case "multiple-choice":
    case "single-choice":
    case "dropdown":
      return { options: ["Option 1", "Option 2", "Option 3"] };
    case "rating":
      return { maxRating: 5 };
    case "date":
      return { format: "MM/DD/YYYY" };
    case "email":
      return { placeholder: "Enter your email" };
    case "phone":
      return { placeholder: "Enter your phone number" };
    case "url":
      return { placeholder: "https://example.com" };
    case "heading":
      return {
        fontSize: "1.75rem",
        alignment: "left",
        color: "#000000",
        content: "Start typing",
      };
    case "subheading":
      return {
        fontSize: "1.25rem",
        alignment: "left",
        color: "#000000",
        content: "Start typing",
      };
    case "paragraph":
      return {
        fontSize: "1rem",
        alignment: "left",
        color: "#000000",
        content: "Start typing",
      };
    case "address":
      return {};
    case "file":
      return {
        maxSize: 5,
        allowedTypes: ["image/*", "application/pdf"],
        numberOfFiles: 1,
      };
    default:
      return {};
  }
}

export default function RenderComponentInput({
  component,
  theme,
  register,
  isPreview = false,
  formId,
}: {
  component: FormComponent;
  theme: FormTheme;
  register?: any; // optional
  isPreview?: boolean;
  formId: string;
}) {
  const formContext = useFormContext();
  const watch = formContext?.watch || (() => undefined);
  const setValue = formContext?.setValue || (() => {});
  const trigger = formContext?.trigger || (() => {});

  const registerProps = register ? register(component.name) : {};

  const inputStyles = {
    backgroundColor: theme.backgroundSecondary,
    color: theme.textSecondary,
    borderRadius: "0.375rem",
    border: `1px solid ${theme.border}`,
  };

  switch (component.type) {
    case "short-text":
      return (
        <Input
          type="text"
          {...component.properties}
          {...registerProps}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
          disabled={isPreview}
        />
      );

    case "email":
      return (
        <Input
          type="email"
          {...component.properties}
          {...registerProps}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
          disabled={isPreview}
        />
      );
    case "address":
      return formContext?.control ? (
        <Controller
          name={component.name}
          control={formContext.control}
          render={({ field }) => <AddressComponent onChange={field.onChange} />}
        />
      ) : (
        <AddressComponent onChange={(val) => console.log(val)} />
      );

    case "phone":
      return formContext?.control ? (
        <Controller
          name={component.name}
          control={formContext.control}
          render={({ field }) => (
            <PhoneInput
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isPreview}
              theme={theme}
            />
          )}
        />
      ) : (
        <PhoneInput theme={theme} value={""} onChange={() => {}} disabled />
      );

    case "number":
      return (
        <Input
          type="number"
          {...component.properties}
          {...(register
            ? register(component.name, {
                valueAsNumber: true,
                min: component.properties.min,
                max: component.properties.max,
              })
            : {})}
          className="focus:ring-2 focus:ring-primary/20 transition-colors"
          style={inputStyles}
          disabled={isPreview}
        />
      );

    case "date":
      return formContext?.control ? (
        <Controller
          name={component.name}
          control={formContext.control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  style={inputStyles}
                  disabled={isPreview}
                >
                  <CalendarIcon className="w-5 h-5" />
                  {field.value
                    ? new Date(field.value).toLocaleDateString()
                    : component.properties?.placeholder || "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(
                        date ? date.toLocaleDateString("en-CA") : "",
                      );
                    }
                  }}
                  initialFocus
                  style={{
                    background: theme.backgroundSecondary,
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      ) : (
        <Button
          variant="outline"
          className="w-full text-muted-foreground justify-start"
          style={inputStyles}
          disabled
        >
          {component.properties?.placeholder || "Pick a date"}
        </Button>
      );

    case "long-text":
      return (
        <Textarea
          {...component.properties}
          {...registerProps}
          className="min-h-[120px] focus:ring-2 transition-colors"
          style={inputStyles}
          disabled={isPreview}
        />
      );

    case "multiple-choice":
      return (
        <div className="space-y-3">
          {component.properties.options?.map((option: string, i: number) =>
            formContext?.control ? (
              <Controller
                key={i}
                name={component.name}
                control={formContext.control}
                render={({ field }) => {
                  const isChecked = field.value?.includes(option);
                  const handleChange = (checked: boolean) => {
                    if (checked) {
                      field.onChange([...(field.value || []), option]);
                    } else {
                      field.onChange(
                        field.value.filter((v: string) => v !== option),
                      );
                    }
                  };

                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={handleChange}
                        disabled={isPreview}
                        id={`${component.name}-${i}`}
                      />
                      <Label htmlFor={`${component.name}-${i}`}>{option}</Label>
                    </div>
                  );
                }}
              />
            ) : (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox disabled={isPreview} id={`${component.name}-${i}`} />
                <Label htmlFor={`${component.name}-${i}`}>{option}</Label>
              </div>
            ),
          )}
        </div>
      );

    case "single-choice":
      return formContext?.control ? (
        <Controller
          name={component.name}
          control={formContext.control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={isPreview}
            >
              {component.properties.options?.map(
                (option: string, i: number) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`${component.name}-${i}`}
                    />
                    <label htmlFor={`${component.name}-${i}`}>{option}</label>
                  </div>
                ),
              )}
            </RadioGroup>
          )}
        />
      ) : (
        <RadioGroup disabled={isPreview}>
          {component.properties.options?.map((option: string, i: number) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${component.name}-${i}`} />
              <label htmlFor={`${component.name}-${i}`}>{option}</label>
            </div>
          ))}
        </RadioGroup>
      );

    case "dropdown":
      return formContext?.control ? (
        <Controller
          name={component.name}
          control={formContext.control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPreview}
            >
              <SelectTrigger style={inputStyles} className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent
                style={{ background: theme.backgroundSecondary }}
                className="backdrop-blur-2xl"
              >
                {component.properties.options?.map(
                  (option: string, i: number) => (
                    <SelectItem key={i} value={option}>
                      {option || "h"}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <Select
          // value={field.value}
          // onValueChange={field.onChange}
          disabled={isPreview}
        >
          <SelectTrigger style={inputStyles} className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent
            style={{ background: theme.backgroundSecondary }}
            className="backdrop-blur-2xl"
          >
            {component.properties.options?.map((option: string, i: number) =>
              option.trim() === "" ? (
                <SelectItem key={i} value="__placeholder__" disabled>
                  <em className="">Empty option</em>
                </SelectItem>
              ) : (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      );

    case "file":
      return formContext?.control ? (
        <Controller
          name={component.name}
          control={formContext.control}
          render={({ field }) => (
            <FileUpload
              theme={theme}
              component={component}
              value={field.value || []}
              onChange={field.onChange}
              disabled={isPreview}
              formId={formId}
            />
          )}
        />
      ) : (
        <FileUpload
          theme={theme}
          component={component}
          value={[]}
          onChange={() => {}}
          disabled
          formId={formId}
        />
      );

    case "rating": {
      const ratingValue = register ? watch(component.name) : 0;

      return (
        <div className="flex gap-2">
          {Array.from({ length: component.properties.maxRating || 5 }).map(
            (_, i) => (
              <label key={i} className="cursor-pointer">
                <input
                  type="radio"
                  value={i + 1}
                  {...(register
                    ? register(component.name, {
                        valueAsNumber: true,
                        onChange: () => {
                          trigger(component.name);
                        },
                      })
                    : {})}
                  className="hidden"
                  checked={Number(ratingValue) === i + 1}
                  disabled={isPreview}
                />
                <Star
                  className="h-6 w-6 transition-colors"
                  style={{
                    color: theme.accent,
                  }}
                  fill={Number(ratingValue) > i ? theme.accent : "none"}
                  strokeWidth={1.5}
                  onClick={() => {
                    if (!isPreview && register) {
                      setValue(component.name, i + 1, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </label>
            ),
          )}
        </div>
      );
    }

    case "url":
      return (
        <div className="flex w-full items-center space-x-2">
          <Link className="w-4 h-4 text-muted-foreground" />
          <Input
            type="url"
            {...component.properties}
            {...registerProps}
            className="focus:ring-2 focus:ring-primary/20 transition-colors"
            style={inputStyles}
            disabled={isPreview}
          />
        </div>
      );

    case "heading":
      return (
        <h1
          className="text-2xl font-bold max-w-3xl"
          style={{
            fontSize: component.properties.fontSize || "1.75rem",
            textAlign: component.properties.alignment || "left",
            color: component.properties.color || theme.text,
          }}
        >
          {component.properties.content || "Heading"}
        </h1>
      );

    case "subheading":
      return (
        <h2
          className="text-xl font-semibold max-w-3xl"
          style={{
            fontSize: component.properties.fontSize || "1.25rem",
            textAlign: component.properties.alignment || "left",
            color: component.properties.color || theme.text,
          }}
        >
          {component.properties.content || "Subheading"}
        </h2>
      );

    case "paragraph":
      return (
        <p
          className="text-base max-w-xl"
          style={{
            fontSize: component.properties.fontSize || "1rem",
            textAlign: component.properties.alignment || "left",
            color: component.properties.color || theme.text,
          }}
        >
          {component.properties.content ||
            "Enter your paragraph text here. This text can be used for instructions, explanations, or any additional information you want to provide to form respondents."}
        </p>
      );

    default:
      return null;
  }
}

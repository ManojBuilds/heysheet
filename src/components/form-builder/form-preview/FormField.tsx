import { FormComponent, FormTheme } from "@/types/form-builder";
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import RenderComponentInput from "./RenderComponentInput";

export const FormField = memo(
  ({
    component,
    theme,
    formId,
  }: {
    component: FormComponent;
    theme: FormTheme;
    formId: string;
  }) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    // Check if component is a display-only component
    const isDisplayComponent = ["heading", "subheading", "paragraph"].includes(
      component.type,
    );

    if (isDisplayComponent) {
      return (
        <div className="py-1">
          <RenderComponentInput
            component={component}
            theme={theme}
            register={register}
            formId={formId}
          />
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div>
          <h3 className="font-medium mb-1 text-base md:text-2xl" style={{ color: theme.text }}>
            {component.title}
            {component.required && (
              <span className="ml-1" style={{ color: theme.primary }}>
                *
              </span>
            )}
          </h3>
          {component.description && (
            <p className="text-sm md:text-base" style={{ color: theme.textSecondary }}>
              {component.description}
            </p>
          )}
        </div>
        <RenderComponentInput
          component={component}
          theme={theme}
          register={register}
          formId={formId}
        />
        {errors[component.name] && (
          <p className="text-sm mt-1" style={{ color: theme.error }}>
            {errors[component.name]?.message as string}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";

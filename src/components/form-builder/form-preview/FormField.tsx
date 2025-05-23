import { FormComponent, FormTheme } from "@/types/form-builder";
import { memo } from "react";
import { useFormContext } from "react-hook-form";
import RenderComponentInput from "./RenderComponentInput";

export const FormField = memo(
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
                <RenderComponentInput
                    component={component}
                    theme={theme}
                    register={register}
                />
                {errors[component.name] && (
                    <p className="text-sm mt-1" style={{ color: theme.errorColor }}>
                        {errors[component.name]?.message as string}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";

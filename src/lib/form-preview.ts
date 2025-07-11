import { FormComponent } from "@/types/form-builder";
import { z } from "zod";

export const getZodSchemaForComponent = (
  field: FormComponent,
): z.ZodObject<any> => {
  const { name, type, title, required, properties } = field;
  const shape: Record<string, z.ZodTypeAny> = {};

  if (["heading", "subheading", "paragraph"].includes(type)) {
    return z.object({});
  }

  let schema: z.ZodTypeAny;

  switch (type) {
    case "short-text":
    case "long-text":
    case "address":
      schema = z
        .string()
        .transform((val) => val?.trim() || "")
        .refine((val) => !required || val.length > 0, `${title} is required`);
      break;

    case "email":
      schema = z
        .string()
        .transform((val) => val?.trim() || "")
        .refine(
          (val) =>
            !required ||
            (val.length > 0 && z.string().email().safeParse(val).success),
          "Invalid email",
        );
      break;

    case "phone":
      schema = z
        .string()
        .transform((val) => val?.trim() || "")
        .refine(
          (val) =>
            !required || val.length === 0 || /^[\d\-\+\(\) ]+$/.test(val),
          "Invalid phone number",
        );
      break;

    case "number": {
      schema = z
        .union([
          z
            .string()
            .transform((val) => (val === "" ? undefined : Number(val)))
            .refine(
              (val) => !required || typeof val === "number" || val === undefined,
              `${title} must be a number`,
            ),
          z.number().optional(), // in case it's already parsed
        ])
        .optional();
      break;
    }

    case "rating": {
      schema = z
        .any()
        .transform((val) => {
          if (val === null || val === "") return undefined;
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        })
        .refine(
          (val) => {
            if (required) {
              return (
                typeof val === "number" &&
                val >= 1 &&
                val <= properties.maxRating
              );
            }
            return (
              val === undefined ||
              (typeof val === "number" &&
                val >= 1 &&
                val <= properties.maxRating)
            );
          },
          {
            message: `Rating must be between 1 and ${properties.maxRating}`,
          },
        );
      break;
    }

    case "date":
      schema = z
        .string()
        .refine(
          (val) => !required || val.length === 0 || !isNaN(Date.parse(val)),
          "Invalid date",
        );
      break;

    case "single-choice":
    case "dropdown": {
      const opts = properties.options;
      schema = z
        .string()
        .refine(
          (val) => !required || opts.includes(val),
          `Please select a valid option`,
        );
      break;
    }

    case "multiple-choice": {
      const opts = properties.options;
      schema = z
        .array(z.string())
        .refine(
          (arr) => !required || (Array.isArray(arr) && arr.length > 0),
          `${title} is required`,
        )
        .optional();
      break;
    }

    case "file":
      schema = z
        .array(z.string().url())
        .refine((arr) => !required || arr.length > 0, `${title} is required`);
      break;

    case "url":
      schema = z
        .string()
        .transform((val) => val?.trim() || "")
        .refine(
          (val) =>
            !required ||
            val.length === 0 ||
            z.string().url().safeParse(val).success,
          "Invalid URL",
        );
      break;

    default:
      schema = z.any(); // fallback
  }

  shape[name] = schema;
  return z.object(shape);
};
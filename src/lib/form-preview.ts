import { FormComponent, FormPage } from "@/types/form-builder";
import { z } from "zod";

// TODO: Add support for nested objects
export const getZodSchemasByPage = (
  pages: FormPage[],
  fields: FormComponent[],
): Record<string, z.ZodObject<any>> => {
  const result: Record<string, z.ZodObject<any>> = {};

  for (const page of pages) {
    const pageFields = fields.filter((f) => f.pageId === page.id);
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const field of pageFields) {
      const { name, type, title, required, properties } = field;

      // Skip layout-only components
      if (["heading", "subheading", "paragraph"].includes(type)) continue;

      let schema: z.ZodTypeAny;

      switch (type) {
        case "short-text":
        case "long-text":
        case "address":
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
          const s = z
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

        case "file":
          schema = required
            ? z
                .array(z.string().url("Invalid file URL"))
                .min(1, `${title} is required`)
            : z.array(z.string().url()).optional();
          break;

        case "url":
          schema = required
            ? z.string().url("Invalid URL")
            : z.string().url().optional();
          break;

        default:
          schema = z.any(); // fallback for unknown types
      }

      shape[name] = schema;
    }

    result[page.id] = z.object(shape);
  }

  return result;
};

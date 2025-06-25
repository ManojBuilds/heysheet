// lib/render-email-template.ts
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EmailTemplate from "@/components/email-template";
import type { FormSubmissionData } from "@/components/email-template";

export async function renderEmailHtml(data: FormSubmissionData): string {
  const emailTemplate = await EmailTemplate({ data });
  const html = renderToStaticMarkup(emailTemplate);
  return `<!DOCTYPE html>${html}`; // Optional: Add DOCTYPE for compatibility
}

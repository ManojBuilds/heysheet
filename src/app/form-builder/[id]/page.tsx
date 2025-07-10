import FormBuilder from "@/components/form-builder/FormBuilder";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Form Builder - Heysheet: Submits any Google Forms to Google Sheets and Notion. Instantly.",
  description: "Create and manage forms with Heysheet's Form Builder. Heysheet is the ultimate form backend for Google Sheets & Notion. Streamline your data collection with real-time sync, a visual form builder, and robust analytics. A powerful alternative to SheetMonkey and NotionMonkey.",
  keywords: 'heysheet, google forms, google sheets, notion, form backend, form builder, real-time sync, sheetmonkey alternative, notionmonkey alternative, serverless forms, data collection, form submissions, form creator, visual builder',
};

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FormBuilder formId={id} />;
}

import FormBuilder from "@/components/form-builder/FormBuilder";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Form Builder - HeySheet",
  description: "Create and manage forms with HeySheet's Form Builder.",
};

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FormBuilder formId={id} />;
}

import FormBuilder from "@/components/form-builder/FormBuilder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build forms with drag an drop"
}

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FormBuilder formId={id} />;
}

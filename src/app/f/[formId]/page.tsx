import FormPreview from "@/components/form-builder/FormPreview";
import { FormDisplay } from "@/components/FormDisplay";
import { getForm } from "@/lib/form";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

interface FormPageProps {
  params: Promise<{
    formId: string;
  }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { formId } = await params;
  const formRes = await getForm(formId);

  if (!formRes?.form) {
    notFound();
  }

  return (
    <FormPreview
      endpoint={formRes.endpoint?.slug}
      formData={{ ...formRes.form, activePage: formRes.form.active_page }}
    />
  );
}

export async function generateMetadata(
  { params }: FormPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { formId } = await params;
  const formRes = await getForm(formId);
  return {
    title: formRes?.form.title,
  };
}

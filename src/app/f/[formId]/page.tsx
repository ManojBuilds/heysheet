import FormPreview from "@/components/form-builder/FormPreview";
import { FormDisplay } from "@/components/FormDisplay";
import { getForm } from "@/lib/form";
import { notFound } from "next/navigation";

interface FormPageProps {
  params: Promise<{
    formId: string;
  }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { formId } = await params;
  const form = await getForm(formId);

  if (!form) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="py-10">
        {/* <FormDisplay
          title={form.title}
          theme={form.theme}
          components={form.components}
          pages={form.pages}
          activePage={form.active_page}
        /> */}
        <FormPreview
          formData={{ ...form, activePage: form.active_page }}
        />
      </div>
    </main>
  );
}

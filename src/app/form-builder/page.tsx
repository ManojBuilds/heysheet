import FormBuilder from "@/components/form-builder/FormBuilder";

export default async function FormBuilderPage({searchParams}: {searchParams: Promise<{endpoint_id: string}>}) {
  const {endpoint_id} = await searchParams;
  return <FormBuilder endpointId={endpoint_id} />;
}

import { createClient } from "./supabase/server";

export async function getForm(formId: string) {
  const supabase = await createClient();

  const { data: form, error } = await supabase
    .from("forms")
    .select(
      `
     * 
    `
    )
    .eq("id", formId)
    .single();

  if (error || !form) {
    return null;
  }
  console.log(form, form.endpoint_id)

  const {data: endpoint, error: endpointError} = await supabase.from('endpoints').select('slug').eq('id', form.endpoint_id).single()
  console.log({endpoint})
  if(endpointError || !endpoint)  return null

  return {form, endpoint};
}

import { createClient } from "./supabase/server";

export async function getForm(formId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forms")
    .select(
      `
     redirect_url,
     title, builder_config, id
    `,
    )
    .eq("id", formId)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

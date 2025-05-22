import { createClient } from "./supabase/server";

export async function getForm(formId: string) {
  const supabase = await createClient();

  const { data: form, error } = await supabase
    .from("forms")
    .select(
      `
      id,
      title,
      theme,
      components,
      pages,
      active_page
    `
    )
    .eq("id", formId)
    .single();

  if (error || !form) {
    return null;
  }

  return form;
}

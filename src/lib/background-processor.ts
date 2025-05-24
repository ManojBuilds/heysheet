import { createClient } from "@/lib/supabase/server";

export async function updateSubmissionStatus(submissionId: string, status: string, error?: string) {
  const supabase = await createClient();
  const updateData: any = {
    status,
    processed_at: error ? null : new Date().toISOString(),
  };
  
  if (error) {
    updateData.error_message = error;
  }
  
  await supabase
    .from("submissions")
    .update(updateData)
    .eq("id", submissionId);
}
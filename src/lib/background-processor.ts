import { createClient } from "@/lib/supabase/server";

export async function updateSubmissionStatus(
  submissionId: string,
  status: "pending" | "completed" | "failed" | "processing",
  _error?: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", submissionId);

  if (error) {
    console.error("@updateSubmissionStatus DB error:", error);
    throw error;
  }

  if (_error) {
    console.error("@updateSubmissionStatus Runtime Error:", _error);
  }
}

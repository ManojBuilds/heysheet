import { createClient } from "@/lib/supabase/server";

export async function updateSubmissionStatus(
  submissionId: string,
  status: "pending" | "completed" | "failed" | "processing",
  _error?: string, // kept for logging only
) {
  console.log("@updateSubmissionStatus", submissionId, status, _error);
  const supabase = await createClient();

  // Only update `status`, not error_message or processed_at
  const { error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", submissionId);

  if (error) {
    console.error("@updateSubmissionStatus DB error:", error);
    throw error;
  }

  if (_error) {
    // Just log error but don’t store it
    console.error("@updateSubmissionStatus Runtime Error:", _error);
  }
}

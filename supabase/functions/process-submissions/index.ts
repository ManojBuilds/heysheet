// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// import { createClient } from 'jsr:@supabase/supabase-js@2';
import { processSubmission, updateSubmissionStatus } from "./lib.ts";
Deno.serve(async (req)=>{
  try {
    const { submissionId, data } = await req.json();
    // const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
    await updateSubmissionStatus(submissionId, "processing");
    try {
      await processSubmission(submissionId, data);
      await updateSubmissionStatus(submissionId, "completed");
    } catch (error) {
      await updateSubmissionStatus(submissionId, "failed");
      console.log("❌ Submission processing error:", error.message || error);
    }
    return new Response(JSON.stringify({
      message: "Submission processed successfully"
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({
      message: err?.message ?? err
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});

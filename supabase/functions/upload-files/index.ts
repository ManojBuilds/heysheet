// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
Deno.serve(async (req) => {
  const formData = await req.formData();
  const file = formData.get('file');
  const filePath = formData.get('path');
  // TODO: update your-bucket to the bucket you want to write files
  const { _, error } = await supabase.storage.from('form-submissions').upload(filePath, file, {
    contentType: file.type
  });
  if (error) throw error;
  const { data, error: signedUrlError } = await supabase.storage
    .from("form-submissions")
    .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year
  if (signedUrlError) throw signedUrlError;
  return new Response(JSON.stringify({
    url: data?.signedUrl
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

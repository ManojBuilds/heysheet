import { createClient } from 'jsr:@supabase/supabase-js@2';
import { planLimits } from './planLimits.ts';
import { createFormSubmissionMessage, sendMessage } from './slack.ts';
import { appendToSheet } from './sheets.ts';
export async function updateSubmissionStatus(submissionId, status) {
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
  const { error } = await supabase.from("submissions").update({
    status
  }).eq("id", submissionId);
  if (error) {
    console.error("@updateSubmissionStatus DB error:", error);
    throw error;
  }
}
export async function processSubmission(submissionId, formData) {
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
  const { data: submission, error: submissionError } = await supabase.from("submissions").select(`
      *,
      form:forms (
        *,
        slack_account:slack_accounts (*)
      )
    `).eq("id", submissionId).single();
  if (submissionError || !submission?.form) {
    console.error("Submission or form not found", submissionError);
    throw new Error("Submission or form not found");
  }
  const { form } = submission;
  if (!formData || Object.keys(formData).length === 0) {
    throw new Error("Submission contains no data");
  }
  // ✅ Fetch user subscription plan
  const { data: subscriptionData } = await supabase.from("subscriptions").select("plan").eq("user_id", form.user_id).single();
  console.log('subscription', subscriptionData);
  const plan = subscriptionData?.plan || "free";
  const limits = planLimits[plan];
  try {
    await appendToSheet(form.google_account_id, form.spreadsheet_id, form.sheet_name, formData);
    const messageData = {
      form: {
        name: form.title,
        spreadsheet_id: form.spreadsheet_id
      },
      submission: {
        created_at: submission.created_at,
        data: formData,
        id: submission.id
      },
      analytics: {
        referrer: submission.referrer,
        country: submission.analytics.country,
        city: submission.analytics.city,
        timezone: submission.analytics.timezone,
        deviceType: submission.analytics.device_type,
        browser: submission.analytics.browser,
        language: submission.analytics.language,
        processed_at: submission.created_at,
        created_at: submission.created_at
      }
    };
    console.log("Checking for slackIntegrations", {
      form,
      limits
    });
    // ✅ Send Slack notification (only if plan allows + properly configured)
    if (limits.features.slackIntegration && form.slack_enabled && form.slack_channel && form.slack_account) {
      console.log("📤 Sending Slack message...", messageData);
      const messagePayload = await createFormSubmissionMessage(messageData);
      await sendMessage(form.slack_channel, messagePayload, form.slack_account.slack_token).catch(console.error);
    }
    return {
      success: true
    };
  } catch (error) {
    console.error("❌ Error processing submission:", error);
    throw error;
  }
}

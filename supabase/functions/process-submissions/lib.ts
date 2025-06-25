import { createClient } from 'jsr:@supabase/supabase-js@2';
import { planLimits } from './planLimits.ts';
import { FormSubmissionData } from './types.ts';
import { createFormSubmissionMessage, sendMessage } from './slack.ts';

export async function updateSubmissionStatus(
    submissionId: string,
    status: "pending" | "completed" | "failed" | "processing",
    _error?: string,
) {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
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


export async function processSubmission(
    submissionId: string,
    formData: object,
) {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');

    const { data: submission, error: submissionError } = await supabase
        .from("submissions")
        .select(
            `
      *,
      form:forms (
        *,
        slack_account:slack_accounts (*)
      )
    `,
        )
        .eq("id", submissionId)
        .single();

    if (submissionError || !submission?.form) {
        console.error("Submission or form not found", submissionError);
        throw new Error("Submission or form not found");
    }

    const { form } = submission;

    if (!formData || Object.keys(formData).length === 0) {
        throw new Error("Submission contains no data");
    }

    console.log("@submission", submission);

    // ✅ Fetch user subscription plan
    const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("clerk_user_id", form.user_id)
        .single();

    const plan = subscriptionData?.plan || "free";
    const limits = planLimits[plan as keyof typeof planLimits];

    try {
       

        const messageData: FormSubmissionData = {
            form: {
                name: form.title,
                spreadsheet_id: form.spreadsheet_id,
            },
            submission: {
                created_at: submission.created_at,
                data: formData,
                id: submission.id,
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
                created_at: submission.created_at,
            },
        };

        // ✅ Send Slack notification (only if plan allows + properly configured)
        if (
            limits.features.slackIntegration &&
            form.slack_enabled &&
            form.slack_channel &&
            form.slack_account
        ) {
            console.log("📤 Sending Slack message...", messageData);
            const messagePayload = await createFormSubmissionMessage(messageData);
            await sendMessage(
                form.slack_channel,
                messagePayload,
                form.slack_account.slack_token,
            ).catch(console.error);
        }
        return { success: true };
    } catch (error: any) {
        console.error("❌ Error processing submission:", error);
        throw error;
    }
}

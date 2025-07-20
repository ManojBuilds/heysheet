import { getUserLocationInfo } from "@/actions";
import { FormSubmissionData } from "@/components/email-template";
import { createClient } from "@/lib/supabase/server";
import { planLimits } from "@/lib/planLimits";
import { collectAnalytics } from "@/lib/submission";
import { extractUtmParams } from "@/lib/utm";
import { processFileUploads } from "@/lib/processFileUpload";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { headers } from "next/headers";
import { validateDomains } from "@/lib/domain-validation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    const { formId } = await params;
    const supabase = await createClient();
    const allHeaders = await headers();
    const userAgent = allHeaders.get("user-agent") || "";
    const referrer = allHeaders.get("referrer") || "";
    const contentType = allHeaders.get("content-type") || "";
    let entries: [string, any][] = [];

    if (contentType.includes("application/json")) {
      const json = await request.json();
      entries = Object.entries(json);
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      entries = Array.from(formData.entries());
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported content type" },
        { status: 415 },
      );
    }
    console.log("entries", entries);

    const { data: form, error: formError } = await supabase
      .from("forms")
      .select(
        `
    id, 
    user_id, 
    file_upload, 
    email_enabled, 
    notification_email, 
    title, 
    spreadsheet_id, 
    sheet_name, 
    google_account_id, 
    notion_database_id, 
    notion_enabled, 
    notion_account_id,
    domains,
    webhook_enabled,
    notion_accounts (
      access_token
    )
    `,
      )
      .eq("id", formId)
      .single();

    if (!form || formError) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 },
      );
    }

    validateDomains(form.domains, allHeaders)

    const [subscriptionRes, userFormsRes] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("plan, next_billing")
        .eq("user_id", form.user_id)
        .single(),
      supabase.from("forms").select("id").eq("user_id", form.user_id),
    ]);

    const plan = subscriptionRes.data?.plan || "free";
    const expiry = subscriptionRes.data?.next_billing
      ? new Date(subscriptionRes.data.next_billing)
      : null;
    if (plan !== "free" && expiry && Date.now() > expiry.getTime()) {
      return NextResponse.json(
        {
          success: false,
          message: "Your subscription has expired. Please renew.",
        },
        { status: 403 },
      );
    }

    const planLimit = planLimits[plan as keyof typeof planLimits];
    const formIds = userFormsRes.data?.map((f) => f.id) || [];

    const startOfMonth = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
    ).toISOString();
    const { count: submissionCount } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth)
      .in("form_id", formIds);

    if ((submissionCount ?? 0) >= planLimit.maxSubmissions) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission limit reached. Please upgrade.",
        },
        { status: 403 },
      );
    }

    const uploadConfig = form.file_upload || {};
    const formDataObj = await processFileUploads({
      entries,
      uploadConfig,
      planLimit,
      formId,
      supabase,
    });
    console.log("Processed form data:", formDataObj);

    const ip = allHeaders.get("x-forwarded-for") || "";
    const language = allHeaders.get("accept-language") || "";
    const location = await getUserLocationInfo().catch(() => ({}));

    const analytics = collectAnalytics({
      ip_address: ip,
      user_agent: userAgent,
      mobile: allHeaders.get("sec-ch-ua-mobile") === "?1",
      referrer,
      language,
      location,
    });

    const utm = extractUtmParams(request.nextUrl.searchParams);

    const { data: submission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        referrer,
        form_id: formId,
        ip_address: location.ip,
        user_agent: userAgent,
        analytics,
        utm,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert failed", insertError);
      return NextResponse.json(
        { success: false, message: "Insert failed" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ success: true, id: submission.id });

    Promise.resolve().then(async () => {
      try {
        const formDataObj = await processFileUploads({
          entries,
          uploadConfig,
          planLimit,
          formId,
          supabase,
        });
        void supabase.functions.invoke("process-submissions", {
          body: {
            submissionId: submission.id,
            data: formDataObj,
          },
        }).then((d) => console.log('@processSubmission success', d)).catch((e) => console.log('@processSubmission failed', e));
        const messageData: FormSubmissionData = {
          form: {
            name: form.title,
            spreadsheet_id: form.spreadsheet_id,
          },
          submission: {
            created_at: submission.created_at,
            data: formDataObj,
            id: submission.id,
          },
          analytics: {
            referrer: referrer,
            country: analytics.country,
            city: analytics.city,
            timezone: analytics.timezone,
            deviceType: analytics.device_type,
            browser: analytics.browser,
            language: analytics.language,
            processed_at: submission.created_at,
            created_at: submission.created_at,
          },
        };
        if (
          planLimit.features.emailAlerts &&
          form.email_enabled &&
          form.notification_email
        ) {
          void sendEmail({
            dataToSend: messageData,
            toEmail: form.notification_email,
          });
        }

        if (form.webhook_enabled) {
          const { data: webhookData, error: webhookError } = await supabase
            .from("webhooks")
            .select("url, secret")
            .eq("form_id", formId)
            .single();

          if (webhookError) {
            console.error("Error fetching webhook:", webhookError);
          } else if (webhookData) {
            const payload = {
              formId: form.id,
              submissionId: submission.id,
              data: formDataObj,
              createdAt: submission.created_at,
            };

            void supabase.functions.invoke("send-webhook", {
              body: {
                webhookUrl: webhookData.url,
                payload: payload,
                secret: webhookData.secret,
              },
            }).then((d) => console.log('@send-webhook success', d)).catch((e) => console.log('@send-webhook failed', e));
          }
        }
        // @ts-expect-error: notion_accounts might be null or undefined
        const notionAccessToken = form.notion_accounts?.access_token;
        if (
          planLimit.features.notionIntegration &&
          form.notion_enabled &&
          form.notion_database_id &&
          notionAccessToken
        ) {
          void supabase.functions.invoke(
            "append-to-notion-db",
            {
              body: {
                accessToken: notionAccessToken,
                databaseId: form.notion_database_id,
                data: formDataObj,
              },
            },
          ).then((d) => console.log('@appendToNotionDB', d)).catch((e) => console.log('@appendToNotionDB failed: ', e));

        }
      } catch (err) {
        console.error("Background task error:", err);
      }
    });

    return response;
  } catch (error: any) {
    console.error("❌ Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

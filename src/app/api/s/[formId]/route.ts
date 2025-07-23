import { getUserLocationInfo } from "@/actions";
import HeySheetSubmissionEmail, { FormSubmissionData } from "@/components/email-template";
import { createClient } from "@/lib/supabase/server";
import { planLimits } from "@/lib/planLimits";
import { collectAnalytics } from "@/lib/submission";
import { extractUtmParams } from "@/lib/utm";
import { processFileUploads } from "@/lib/processFileUpload";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { validateDomains } from "@/lib/domain-validation";
import { render } from "@react-email/components";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    const [{ formId }, supabase, headersList] = await Promise.all([
      params, createClient(), headers()
    ])
    const userAgent = headersList.get("user-agent") || "";
    const referrer = headersList.get("referrer") || "";
    const contentType = headersList.get("content-type") || "";
    let entries: [string, any][] = [];

    if (contentType.includes("application/json")) {
      const json = await request.json();
      entries = Object.entries(json);
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
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

    validateDomains(form.domains, headersList)

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

    const ip = headersList.get("x-forwarded-for") || "";
    const language = headersList.get("accept-language") || "";
    const location = await getUserLocationInfo().catch(() => ({}));

    const analytics = collectAnalytics({
      ip_address: ip,
      user_agent: userAgent,
      mobile: headersList.get("sec-ch-ua-mobile") === "?1",
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
            id: formId,
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
            created_at: new Date(submission.created_at).toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          },
        };
        if (
          planLimit.features.emailAlerts &&
          form.email_enabled &&
          form.notification_email
        ) {
          console.log('Sending email')
          const emailTemplate = HeySheetSubmissionEmail({ data: messageData });
          const html = await render(emailTemplate)
          void supabase.functions.invoke('send-email', {
            body: {
              to: form.notification_email,
              subject: `New Submission on ${messageData.form.name}`,
              html
            }
          }).catch(e => console.error(e))

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
            console.log('@sendingWebhook')

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
          console.log('Invoking append-to-notion-db')
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

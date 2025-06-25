import { getUserLocationInfo } from "@/actions";
import { FormSubmissionData } from "@/components/email-template";
import { createClient } from "@/lib/supabase/server";
import { planLimits } from "@/lib/planLimits";
import { collectAnalytics } from "@/lib/submission";
import { extractUtmParams } from "@/lib/utm";
import { processFileUploads } from "@/lib/processFileUpload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    const { formId } = await params;
    const supabase = await createClient();
    const headers = request.headers;
    const userAgent = headers.get("user-agent") || "";
    const referrer = headers.get("referrer") || "";
    const formData = await request.formData();
    const entries = Array.from(formData.entries());

    const { data: form, error: formError } = await supabase
      .from("forms")
      .select(
        "id, user_id, file_upload, email_enabled, notification_email, title, spreadsheet_id, sheet_name, google_account_id",
      )
      .eq("id", formId)
      .single();

    if (!form || formError) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 },
      );
    }

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

    const ip = headers.get("x-forwarded-for") || "";
    const language = headers.get("accept-language") || "";
    const location = await getUserLocationInfo().catch(() => ({}));

    const analytics = collectAnalytics({
      ip_address: ip,
      user_agent: userAgent,
      mobile: headers.get("sec-ch-ua-mobile") === "?1",
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

    (async () => {
      const { appendToSheet } = await import("@/lib/google/sheets");
      await appendToSheet(
        form.google_account_id,
        form.spreadsheet_id,
        form.sheet_name,
        formDataObj,
      );
    })().catch(console.error);

    void supabase.functions.invoke("process-submissions", {
      body: {
        submissionId: submission.id,
        data: formDataObj,
      },
    });

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
      (async () => {
        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
          dataToSend: messageData,
          toEmail: form.notification_email,
        });
      })().catch(console.error);
    }

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error: any) {
    console.error("❌ Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

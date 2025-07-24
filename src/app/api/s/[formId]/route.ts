import { getUserLocationInfo } from "@/actions";
import HeySheetSubmissionEmail, { FormSubmissionData } from "@/components/email-template";
import { createClient } from "@/lib/supabase/server";
import { planLimits } from "@/lib/planLimits";
import { collectAnalytics } from "@/lib/submission";
import { extractUtmParams } from "@/lib/utm";
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
    ]);

    const userAgent = headersList.get("user-agent") || "";
    const referrer = headersList.get("referrer") || "";
    const contentType = headersList.get("content-type") || "";
    let entries: [string, any][] = [];
    let formDataObj: Record<string, any> = {}

    if (contentType.includes("application/json")) {
      const json = await request.json();
      formDataObj = json
      entries = Object.entries(json);
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      formData.entries().forEach(([key, value]) => {
        console.log('looping through', { key, value })
        formDataObj[key] = value;
      })
      entries = Array.from(formData.entries());
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported content type" },
        { status: 415 },
      );
    }
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select(`
        id, user_id, file_upload, email_enabled, notification_email, 
        title, spreadsheet_id, sheet_name, google_account_id, 
        notion_database_id, notion_enabled, notion_account_id,
        domains, webhook_enabled,
        notion_accounts ( access_token )
      `)
      .eq("id", formId)
      .single();

    if (!form || formError) {
      console.error(formError)
      return NextResponse.json({ success: false, message: "Form not found" }, { status: 404 });
    }

    validateDomains(form.domains, headersList);

    const [subscriptionRes, userFormsRes] = await Promise.all([
      supabase.from("subscriptions").select("plan, next_billing").eq("user_id", form.user_id).single(),
      supabase.from("forms").select("id").eq("user_id", form.user_id),
    ]);

    const plan = subscriptionRes.data?.plan || "free";
    const expiry = subscriptionRes.data?.next_billing
      ? new Date(subscriptionRes.data.next_billing)
      : null;
    if (plan !== "free" && expiry && Date.now() > expiry.getTime()) {
      return NextResponse.json({ success: false, message: "Subscription expired" }, { status: 403 });
    }

    const planLimit = planLimits[plan as keyof typeof planLimits];
    const formIds = userFormsRes.data?.map((f) => f.id) || [];

    const startOfMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();
    const { count: submissionCount } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth)
      .in("form_id", formIds);

    if ((submissionCount ?? 0) >= planLimit.maxSubmissions) {
      return NextResponse.json({ success: false, message: "Submission limit reached" }, { status: 403 });
    }

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
      return NextResponse.json({ success: false, message: "Insert failed" }, { status: 500 });
    }

    supabase.functions.invoke("submission-handler", {
      body: {
        submission,
        form,
        analytics,
        referrer,
        formDataObj,
        planLimit,
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error: any) {
    console.error("❌ Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

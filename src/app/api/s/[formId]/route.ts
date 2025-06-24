import { getUserLocationInfo } from "@/actions";
import { planLimits } from "@/lib/planLimits";
import { collectAnalytics } from "@/lib/submission";
import { uploadFile } from "@/lib/supabase/s3";
import { createClient } from "@/lib/supabase/server";
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

    // === Step 1: Fetch form & user info in parallel
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("id, user_id, file_upload")
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

    // === Step 2: Submission limit check
    const startOfMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();
    const { count: submissionCount } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth)
      .in("form_id", formIds);

    if ((submissionCount ?? 0) >= planLimit.maxSubmissions) {
      return NextResponse.json(
        { success: false, message: "Submission limit reached. Please upgrade." },
        { status: 403 },
      );
    }

    // === Step 3: Process inputs (parallel file uploads)
    const uploadConfig = form.file_upload || {};
    const formDataObj: Record<string, any> = {};
    let fileCount = 0;

    await Promise.all(entries.map(async ([key, value]) => {
      if (value instanceof File) {
        if (!uploadConfig.enabled)
          throw new Error("File uploads are disabled for this form.");

        fileCount++;
        if (fileCount > (uploadConfig.max_files ?? Infinity)) {
          throw new Error(`You can only upload ${uploadConfig.max_files} file(s).`);
        }

        if (
          uploadConfig.allowed_file_types?.length &&
          !uploadConfig.allowed_file_types.includes(value.type)
        ) {
          throw new Error(`File type ${value.type} not allowed.`);
        }

        const fileSizeMB = value.size / (1024 * 1024);
        if (fileSizeMB > planLimit.maxFileSizeMB) {
          throw new Error(`File too large. Max is ${planLimit.maxFileSizeMB}MB.`);
        }

        const filePath = `form-submissions/${formId}/${key}-${value.name}`;
        await uploadFile("form-submissions", filePath, value);

        const { data: signedUrlData } = await supabase.storage
          .from("form-submissions")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

        formDataObj[key] = signedUrlData?.signedUrl;
      } else {
        formDataObj[key] = value;
      }
    }));

    // === Step 4: Enrich with metadata
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

    const searchParams = request.nextUrl.searchParams;
    const utm = {
      utm_source: searchParams.get("utm_source"),
      utm_medium: searchParams.get("utm_medium"),
      utm_campaign: searchParams.get("utm_campaign"),
      utm_term: searchParams.get("utm_term"),
      utm_content: searchParams.get("utm_content"),
    };

    // === Step 5: Save submission
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

    // === Step 6: Background task (non-blocking)
    setTimeout(() => {
      processSubmissionAsync(submission.id, formDataObj).catch((err) =>
        console.error("❌ Background task error:", err),
      );
    }, 0);

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error: any) {
    console.error("❌ Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

async function processSubmissionAsync(submissionId: string, data: object) {
  const { updateSubmissionStatus } = await import("@/lib/background-processor");
  await updateSubmissionStatus(submissionId, "processing");

  try {
    const { processSubmission } = await import("@/lib/google/sheets");
    await processSubmission(submissionId, data);
    await updateSubmissionStatus(submissionId, "completed");
  } catch (error: any) {
    await updateSubmissionStatus(submissionId, "failed");
    console.error("❌ Submission processing error:", error.message || error);
  }
}

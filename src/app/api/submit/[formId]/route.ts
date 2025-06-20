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
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referrer") || "";
    const formDataObj: Record<string, any> = {};
    const formData = await request.formData();
    const entries = Array.from(formData.entries());

    // === Step 1: Fetch form + user + subscription info
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

    const [{ data: sub }, { data: userForms }] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("plan")
        .eq("clerk_user_id", form.user_id)
        .single(),
      supabase.from("forms").select("id").eq("user_id", form.user_id),
    ]);

    const plan = sub?.plan || "free";
    const planLimit = planLimits[plan as keyof typeof planLimits];
    const formIds = userForms?.map((f) => f.id) || [];

    // === Step 2: Check submission limits
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    ).toISOString();
    const { count: submissionCount } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth)
      .in("form_id", formIds);

    if (submissionCount && submissionCount >= planLimit.maxSubmissions) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission limit reached. Please upgrade.",
        },
        { status: 403 },
      );
    }

    // === Step 3: Process file uploads
    const uploadConfig = form.file_upload || {};
    let fileCount = 0;

    for (const [key, value] of entries) {
      if (value instanceof File) {
        if (uploadConfig.enabled === false) {
          return NextResponse.json(
            {
              success: false,
              message: "File uploads are disabled for this form.",
            },
            { status: 403 },
          );
        }

        fileCount++;
        if (fileCount > (uploadConfig.max_files ?? Infinity)) {
          return NextResponse.json(
            {
              success: false,
              message: `You can only upload ${uploadConfig.max_files} file(s).`,
            },
            { status: 400 },
          );
        }

        if (
          uploadConfig.allowed_file_types?.length &&
          !uploadConfig.allowed_file_types.includes(value.type)
        ) {
          return NextResponse.json(
            { success: false, message: `File type ${value.type} not allowed.` },
            { status: 400 },
          );
        }

        const fileSizeMB = value.size / (1024 * 1024);
        if (fileSizeMB > planLimit.maxFileSizeMB) {
          return NextResponse.json(
            {
              success: false,
              message: `File is too large. Max allowed is ${planLimit.maxFileSizeMB}MB.`,
            },
            { status: 400 },
          );
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
    }

    // === Step 4: Enrich with metadata
    const ip = request.headers.get("x-forwarded-for") || "";
    const language = request.headers.get("accept-language") || "";
    const location = await getUserLocationInfo().catch(() => ({}));

    const analytics = collectAnalytics({
      ip_address: ip,
      user_agent: userAgent,
      mobile: request.headers.get("sec-ch-ua-mobile") === "?1",
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
    const { data: submission, error } = await supabase
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

    if (error) {
      console.error("Submission insert failed", error);
      return NextResponse.json(
        { success: false, message: "Insert failed" },
        { status: 500 },
      );
    }

    // Fire background task
    processSubmissionAsync(submission.id, formDataObj).catch((err) =>
      console.error("Background task failed", err),
    );

    return NextResponse.json({ id: submission.id, success: true });
  } catch (error) {
    console.error("Unexpected error", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
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
    console.error("❌ Background processing error:", error);
  }
}

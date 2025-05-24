import { validateApiKey } from "@/lib/settings";
import { collectAnalytics } from "@/lib/submission";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  let formData: any = {};
  let isFormData = false;

  const referer = request.headers.get("referer") || "";
  const isInternalRequest = referer.includes(
    process.env.NEXT_PUBLIC_APP_URL || ""
  );

  if (!isInternalRequest) {
    const apiKey = request.headers.get("heysheet-api-key");
    if (!apiKey || !validateApiKey(apiKey)) {
      return new Response("Invalid or Missing api key", { status: 401 });
    }
  }

  const contentType = request.headers.get("content-type") || "";
  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    isFormData = true;
    const fd = await request.formData();
    fd.forEach((value, key) => {
      formData[key] = value;
    });
  } else {
    try {
      formData = await request.json();
    } catch {
      formData = {};
    }
  }

  const { slug } = await params;

  try {
    const clientInfo = {
      ip_address: request.headers.get("x-forwarded-for") || "",
      user_agent: request.headers.get("user-agent") || "",
      mobile: request.headers.get("sec-ch-ua-mobile") === "?1",
      referer: request.headers.get("referer") || "",
      language: request.headers.get("accept-language") || "",
      location: {},
    };

    let locationInfo = {};
    try {
      const ipInfoApiKey = process.env.IP_INFO_API_KEY;
      const url = `https://ipinfo.io/json?token=${ipInfoApiKey}`;
      const geoResponse = await fetch(url);
      if (geoResponse.ok) {
        locationInfo = await geoResponse.json();
      }
    } catch (error) {
      console.error("Error fetching IP location info:", error);
    }

    clientInfo.location = locationInfo;
    const analytics = collectAnalytics(clientInfo);
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("handle_form_submission", {
      endpoint_slug: slug,
      form_data: formData,
      client_info: analytics,
    });
    if (error) {
      console.error("Error handling form submission:", error);
      return NextResponse.json(
        { success: false, message: "Error processing submission" },
        { status: 500 }
      );
    }
    if (data.success) {
      processSubmissionAsync(formData, data.submission_id).catch((e) =>
        console.log("Background processing error:", e)
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in submit API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function processSubmissionAsync(formData: any, submissionId: string) {
  const { updateSubmissionStatus } = await import("@/lib/background-processor");
  // TODO: In a production app, this would be handled by a queue system
  await updateSubmissionStatus(submissionId, "processing");
  try {
    const { processSubmission } = await import("@/lib/google/sheets");
    processSubmission(submissionId)
      .then(() => updateSubmissionStatus(submissionId, "completed"))
      .catch(async (error) => {
        console.error("Error processing submission: ", error);
        await updateSubmissionStatus(submissionId, "failed", error.message);
      });
  } catch (error: any) {
    console.error("Error processing submission:", error);
    await updateSubmissionStatus(submissionId, "failed", error.message);
  }
}

import { validateApiKey } from "@/lib/settings";
import { collectAnalytics } from "@/lib/submission";
import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  let formData: any = {};
  let isFormData = false;

  const apiKey = request.headers.get("heysheet-api-key");
  if (!apiKey || !validateApiKey(apiKey)) {
    return new Response("Invalid or Missing api key", { status: 401 });
  }

  // Try to detect and parse formData or JSON
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
      // fallback: empty object if not valid JSON
      formData = {};
    }
  }

  const { slug } = await params;

  try {
    // Get client info
    const clientInfo = {
      ip_address: request.headers.get("x-forwarded-for") || "",
      user_agent: request.headers.get("user-agent") || "",
      mobile: request.headers.get("sec-ch-ua-mobile") === "?1",
      referer: request.headers.get("referer") || "",
      language: request.headers.get("accept-language") || "",
      location: {},
    };

    // Use ipinfo.io API to get location info
    let locationInfo = {};
    try {
      const ipInfoApiKey = process.env.IP_INFO_API_KEY;
      const url = `https://ipinfo.io/json?token=${ipInfoApiKey}`;
      const geoResponse = await fetch(url);
      if (geoResponse.ok) {
        locationInfo = await geoResponse.json();
        console.log("locationInfo", locationInfo);
      }
    } catch (error) {
      console.error("Error fetching IP location info:", error);
    }

    clientInfo.location = locationInfo;

    const analytics = collectAnalytics(clientInfo)
    console.log(analytics);

    // Call the database function to handle the submission
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("handle_form_submission", {
      endpoint_slug: slug,
      form_data: formData,
      client_info: analytics,
    });
    console.log(data)

    if (error) {
      console.error("Error handling form submission:", error);
      return NextResponse.json(
        { success: false, message: "Error processing submission" },
        { status: 500 }
      );
    }

    // Process the submission asynchronously
    if (data.success) {
      await processSubmissionAsync(formData, data.submission_id);
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

// Process submission asynchronously
async function processSubmissionAsync(formData: any, submissionId: string) {
  // TODO: In a production app, this would be handled by a queue system
  try {
    const { processSubmission } = await import("@/lib/google/sheets");
    await processSubmission(formData, submissionId);
  } catch (error) {
    console.error("Error processing submission:", error);
  }
}

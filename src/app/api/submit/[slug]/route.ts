import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Get form data
    const formData = await request.json();

    // Get client info
    const clientInfo = {
      ip_address: request.headers.get("x-forwarded-for") || "",
      user_agent: request.headers.get("user-agent") || "",
      browser: request.headers.get("sec-ch-ua") || "",
      platform: request.headers.get("sec-ch-ua-platform") || "",
      mobile: request.headers.get("sec-ch-ua-mobile") === "?1",
      referer: request.headers.get("referer") || "",
      language: request.headers.get("accept-language") || "",
      location: {}
    };

    // Optionally, you can integrate an IP geolocation service to get location info
    let locationInfo = {};
    if (clientInfo.ip_address) {
      try {
      const geoResponse = await fetch(`https://ipapi.co/${clientInfo.ip_address}/json/`);
      if (geoResponse.ok) {
        locationInfo = await geoResponse.json();
      }
      } catch (error) {
      console.error("Error fetching IP location info:", error);
      }
    }

    clientInfo.location = locationInfo;

    // Call the database function to handle the submission
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("handle_form_submission", {
      endpoint_slug: slug,
      form_data: formData,
      client_info: clientInfo,
    });

    if (error) {
      console.error("Error handling form submission:", error);
      return NextResponse.json(
        { success: false, message: "Error processing submission" },
        { status: 500 }
      );
    }

    // Process the submission asynchronously
    if (data.success) {
      // TODO: In a production app, you would use a queue system here
      // For now, we'll process it in the background
      processSubmissionAsync(data.submission_id);
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
async function processSubmissionAsync(submissionId: string) {
  // TODO: In a production app, this would be handled by a queue system
  try {
    const { processSubmission } = await import("@/lib/google/sheets");
    await processSubmission(submissionId);
  } catch (error) {
    console.error("Error processing submission:", error);
  }
}

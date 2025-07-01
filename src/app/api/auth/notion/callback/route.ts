import { handleNotionCallback } from "@/lib/notion/auth";
import { NextRequest, NextResponse } from "next/server";

function getRedirectUrl(request: NextRequest, path: string): URL {
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return new URL(path, `${proto}://${host}`);
}

export async function GET(request: NextRequest) {
  console.log("Notion OAuth callback request received.");
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  console.log(
    "Callback params - code:",
    code,
    "error:",
    error,
    "state:",
    state,
  );

  if (error) {
    console.error("Notion OAuth error during callback:", error);
    return NextResponse.redirect(
      getRedirectUrl(request, "/integrations?error=notion_auth_denied"),
    );
  }

  if (!code) {
    console.error("Notion OAuth callback: Missing code.");
    return NextResponse.redirect(
      getRedirectUrl(request, "/integrations?error=missing_code"),
    );
  }

  if (!state) {
    console.error("Notion OAuth callback: Missing state.");
    return NextResponse.redirect(
      getRedirectUrl(request, "/integrations?error=missing_state"),
    );
  }

  let parsedState;
  try {
    parsedState = JSON.parse(state);
    console.log("Parsed state:", parsedState);
  } catch (e) {
    console.error("Error parsing state in Notion OAuth callback:", e);
    return NextResponse.redirect(
      getRedirectUrl(request, "/integrations?error=invalid_state"),
    );
  }

  const userId = parsedState.userId;

  if (!userId) {
    console.error("Notion OAuth callback: userId not found in parsed state.");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log(
      "Calling handleNotionCallback with userId:",
      userId,
      request.url,
    );
    const { success } = await handleNotionCallback(userId, code);
    if (success) {
      console.log(
        "Notion callback successful. Redirecting to integrations page.",
      );
      return NextResponse.redirect(
        getRedirectUrl(request, "/integrations?connection=success"),
      );
    }
  } catch (error) {
    console.error("Error in Notion callback handler:", error);
    return NextResponse.redirect(
      getRedirectUrl(request, "/integrations?error=notion_connection_failed"),
    );
  }
  console.error(
    "Notion callback failed for unknown reason. Redirecting to error page.",
  );
  return NextResponse.redirect(
    getRedirectUrl(request, "/integrations?error=notion_connection_failed"),
  );
}

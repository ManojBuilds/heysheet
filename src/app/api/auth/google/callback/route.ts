import { handleGoogleCallback } from "@/lib/google/auth";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=google_auth_denied", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=missing_code", request.url)
    );
  }

  // Get the redirect URI from the state or use a default
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  try {
    // Handle the callback
    const {success } =  await handleGoogleCallback(userId, code, redirectUri);
    if(success) return NextResponse.redirect(
      new URL("/dashboard?connection=success", request.url)
)
  } catch (error) {
    console.error("Error in Google callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=google_connection_failed", request.url)
    );
  }
}

import { getAuthenticatedClient } from "@/lib/google/auth";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { googleAccountId } = await req.json();

  if (!googleAccountId) {
    return NextResponse.json(
      { error: "googleAccountId is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const { data: account, error: accountError } = await supabase
      .from("google_accounts")
      .select("access_token, token_expires_at")
      .eq("id", googleAccountId)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: "Google account not found" },
        { status: 404 }
      );
    }

    const oauth2Client = await getAuthenticatedClient(googleAccountId);
    const newAccessToken = await oauth2Client.getAccessToken();

    if (!newAccessToken.token) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      accessToken: newAccessToken.token,
    });
  } catch (error: any) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
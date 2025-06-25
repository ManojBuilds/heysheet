import { config } from "@/config";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1️⃣ Get the OAuth code
    const code = req.nextUrl.searchParams.get("code");
    const userId = req.nextUrl.searchParams.get("state");

    if (!userId) return NextResponse.json({ message: "Unauthorized" });

    if (!code) {
      return NextResponse.json({ message: "Missing code" }, { status: 400 });
    }

    // 2️⃣ Exchange code for an access token
    const params = new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL!,
    });

    const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.ok) {
      console.error("Slack OAuth error:", tokenData);
      return NextResponse.json(
        { message: "Slack auth failed", details: tokenData.error },
        { status: 400 },
      );
    }

    const accessToken =
      tokenData.access_token || tokenData.authed_user?.access_token;
    const teamId = tokenData.team?.id;
    if (!accessToken || !teamId) {
      return NextResponse.json(
        { message: "Invalid token response from Slack" },
        { status: 500 },
      );
    }

    console.log("Persisting Slack account to Supabase...");
    const { data, error } = await supabase
      .from("slack_accounts")
      .upsert({
        user_id: userId,
        slack_token: accessToken,
        slack_team_id: teamId,
        slack_channel: '',
        // slack_channel_id: channel.id,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Failed to save Slack account" },
        { status: 500 },
      );
    }
    return NextResponse.redirect(
      `${config.appUrl}/dashboard?slack_integration=success`,
    );
  } catch (err: any) {
    console.error("Slack Auth Failed:", err);
    return NextResponse.redirect(
      `${config.appUrl}/dashboard?slack_integration=error`,
    );
  }
}

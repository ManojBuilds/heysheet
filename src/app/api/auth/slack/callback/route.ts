import { createClient } from "@/lib/supabase/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Slack OAuth callback invoked");
    const supabase = await createClient();

    // 1️⃣ Get the OAuth code
    const code = req.nextUrl.searchParams.get("code");
    const userId = req.nextUrl.searchParams.get("state");
    console.log("Received code:", code);
    console.log("userId", userId);

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

    console.log("Exchanging code for access token...");
    const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const tokenData = await tokenRes.json();
    console.log("Slack token response:", tokenData);
    if (!tokenData.ok) {
      console.error("Slack OAuth error:", tokenData);
      return NextResponse.json(
        { message: "Slack auth failed", details: tokenData.error },
        { status: 400 }
      );
    }

    // Use the bot token if available, otherwise the user token
    const accessToken =
      tokenData.access_token || tokenData.authed_user?.access_token;
    const teamId = tokenData.team?.id;
    console.log("Access token:", !!accessToken, "Team ID:", teamId);
    if (!accessToken || !teamId) {
      return NextResponse.json(
        { message: "Invalid token response from Slack" },
        { status: 500 }
      );
    }

    // 3️⃣ List existing channels
    console.log("Listing Slack channels...");
    const listRes = await fetch(
      "https://slack.com/api/conversations.list?exclude_archived=true&limit=1000",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const listData = await listRes.json();
    console.log("Channels list response:", listData);
    if (!listData.ok) {
      throw new Error(listData.error);
    }

    // 4️⃣ Find or create #heysheet
    const channel = listData.channels.find((c: any) => c.name === "heysheetbot");
    // if (!channel) {
    //     console.log("Channel #heysheet not found, creating...");
    //     const createRes = await fetch(
    //         "https://slack.com/api/conversations.create",
    //         {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ name: "heysheetbot", is_private: false }),
    //         }
    //     );
    //     const createData = await createRes.json();
    //     console.log("Create channel response:", createData);
    //     if (!createData.ok) {
    //         throw new Error(createData.error);
    //     }
    //     channel = createData.channel;
    // } else {
    //     console.log("Found #heysheet channel:", channel.id);
    // }

    // 5️⃣ Persist to Supabase
    console.log("Persisting Slack account to Supabase...");
    const { data: slackData, error } = await supabase
      .from("slack_accounts")
      .upsert({
        user_id: userId,
        slack_token: accessToken,
        slack_team_id: teamId,
        slack_channel: listData.channels[0].name,
        // slack_channel_id: channel.id,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Failed to save Slack account" },
        { status: 500 }
      );
    }

    // Creating slack alert
    console.log("Creating slack alert with disabled");
    const { error: slackAlertError } = await supabase
      .from("slack_notifications")
      .upsert([
        {
          user_id: userId,
          slack_channel: "",
          enabled: false,
          slack_account_id: slackData.id,
        },
      ]);
    if (slackAlertError) throw slackAlertError;

    return NextResponse.redirect(
      `http://localhost:3000/dashboard?slack_integration=success`
    );
  } catch (err: any) {
    console.error("Slack Auth Failed:", err);
    return NextResponse.redirect(
      `http://localhost:3000/dashboard?slack_integration=error`
    );
  }
}

import { getNotionAuthUrl as generateNotionAuthUrl } from "@/lib/notion/auth";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  console.log("Notion OAuth initiation request received.");
  const { userId } = await auth();

  if (!userId) {
    console.error("Notion OAuth initiation: Unauthorized user.");
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl");

  const redirectUri = process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL;
  const state = JSON.stringify({
    redirectUrl: redirectUrl || "/integrations",
    userId,
  });
  console.log("Redirecting to Notion for authorization...");
  const authUrl = generateNotionAuthUrl(state);
  return NextResponse.json({ authUrl });
}

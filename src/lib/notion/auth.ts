import { createClient } from "@/lib/supabase/server";

const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;

export const getNotionAuthUrl = (state: string) => {
  console.log(
    "Generating Notion auth URL...",
    NOTION_CLIENT_ID,
    NOTION_CLIENT_SECRET,
  );

  const authUrl = new URL("https://api.notion.com/v1/oauth/authorize");
  authUrl.searchParams.set("client_id", NOTION_CLIENT_ID!);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("owner", "user");
  authUrl.searchParams.set(
    "redirect_uri",
    process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL!,
  );
  authUrl.searchParams.set("state", state);
  console.log("Notion auth URL generated:", authUrl.toString());
  return authUrl.toString();
};

export const handleNotionCallback = async (userId: string, code: string) => {
  console.log("Handling Notion callback for userId:", userId);
  const supabase = await createClient();

  const credentials = Buffer.from(
    `${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`,
  ).toString("base64");

  console.log("Exchanging Notion code for token...");
  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL!,
    }),
  });

  const data = await response.json();
  console.log("Notion token exchange response:", data);

  if (data.error) {
    console.error("Notion OAuth error:", data.error_description || data.error);
    return { success: false, error: data.error_description || data.error };
  }

  const { access_token, owner, workspace_id, workspace_name, workspace_icon } =
    data;

  console.log("Saving Notion account to Supabase...");
  const { data: existingAccount } = await supabase
    .from("notion_accounts")
    .select("access_token")
    .maybeSingle();
  if (existingAccount?.access_token) {
    return { success: true };
  }
  const { error } = await supabase.from("notion_accounts").insert({
    user_id: userId,
    access_token: access_token,
    workspace_id: workspace_id,
    workspace_name: workspace_name,
    workspace_icon: workspace_icon,
    owner_id: owner.user?.id || owner.workspace?.id,
    owner_type: owner.type,
  });

  if (error) {
    console.error("Error saving Notion account to Supabase:", error);
    return { success: false, error: error.message };
  }

  console.log("Notion account saved successfully.");
  return { success: true };
};

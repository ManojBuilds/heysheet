import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { IntegrationsListClient } from "./integrations-list-client";

async function fetchIntegrationsStatus() {
  const user = await auth();
  const supabase = await createClient();

  const [googleRes, slackRes, notionRes] = await Promise.all([
    supabase.from("google_accounts").select("*").eq("user_id", user.userId),

    supabase
      .from("slack_accounts")
      .select("*")
      .eq("user_id", user.userId)
      .single(),
    supabase
      .from("notion_accounts")
      .select("*")
      .eq("user_id", user.userId)
      .single(),
  ]);

  const googleAccount = googleRes.data?.[0];
  const slackAccount = slackRes.data;
  const notionAccount = notionRes.data;

  return { googleAccount, slackAccount, notionAccount };
}

export const IntegrationsList = async () => {
  const { googleAccount, slackAccount, notionAccount } =
    await fetchIntegrationsStatus();
  return (
    <IntegrationsListClient
      googleAccount={googleAccount}
      slackAccount={slackAccount}
      notionAccount={notionAccount}
    />
  );
};

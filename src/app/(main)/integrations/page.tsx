import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { IntegrationsList } from "./integrations-list";

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
  console.log(notionRes);
  const notionAccount = notionRes.data;

  return { googleAccount, slackAccount, notionAccount };
}

export const metadata = {
  title: "Integrations - HeySheet",
  description:
    "Connect your Google Sheets and Slack to receive form submissions.",
};

export default async function IntegrationsPage() {
  const { googleAccount, slackAccount, notionAccount } =
    await fetchIntegrationsStatus();

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Integrations</h1>
      <p className="text-muted-foreground">
        Connect your Google Sheets to receive form submissions
      </p>
      <IntegrationsList
        googleAccount={googleAccount}
        slackAccount={slackAccount}
        notionAccount={notionAccount}
      />
    </div>
  );
}

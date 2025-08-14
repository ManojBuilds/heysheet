import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { FormDetails } from "./form-details";
import { FormDetails as IFormDetails } from "@/types/form-details";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/actions";

export async function FormDetailsFetcher({ id }: { id: string }) {
  const { userId } = await auth();

  const [supabase, subscription] = await Promise.all([
    createClient(),
    getSubscription(),
  ]);

  const [{ data, error }, { data: webhookData }] = await Promise.all([
    supabase
      .from("forms")
      .select(
        "*, slack_account:slack_account_id(*), notion_account:notion_account_id(*), file_upload, webhook_enabled",
      )
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("webhooks")
      .select("url, secret")
      .eq("form_id", id)
      .maybeSingle(),
  ]);

  if (error || !data) {
    return notFound();
  }

  if (data?.user_id !== userId) {
    return redirect("/");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const endpointUrl = `${appUrl}/api/s/${id}`;

  return (
    <FormDetails
      data={data as IFormDetails}
      appUrl={appUrl}
      endpointUrl={endpointUrl}
      id={id}
      initialWebhookEnabled={data.webhook_enabled}
      initialWebhookUrl={webhookData?.url ?? ""}
      initialWebhookSecret={webhookData?.secret ?? ""}
      subscription={subscription}
    />
  );
}

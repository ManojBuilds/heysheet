import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FormTabs } from "./form-tabs";
import { FormDetails } from "@/types/form-details";
import type { Metadata } from "next";
import { FormAnalytics } from "./form-analytics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase
    .from("forms")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: data?.title ? `${data.title} | Form Details` : "Form Details",
    description: "View and manage your form details.",
    openGraph: {
      title: data?.title ? `${data.title} | Form Details` : "Form Details",
      description: "View and manage your form details.",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/forms/${id}`,
    },
  };
}

export default async function EndpointDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select(
      "*, slack_account:slack_account_id(*), notion_account:notion_account_id(*), file_upload, webhook_enabled",
    )
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  const { data: webhookData, error: webhookError } = await supabase
    .from("webhooks")
    .select("url, secret")
    .eq("form_id", id)
    .single();

  if (error || !data) {
    return notFound();
  }

  if (data?.user_id !== userId) {
    return redirect("/");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const endpointUrl = `${appUrl}/api/s/${id}`;

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      <nav>
        <Link href={"/forms"} className="inline-block">
          <Button leftIcon={<ArrowLeft />}>Forms</Button>
        </Link>
      </nav>
      <FormTabs
        defaultTab="overview"
        id={id}
        data={data as FormDetails}
        appUrl={appUrl}
        endpointUrl={endpointUrl}
        formAnalytics={<FormAnalytics id={id} searchParams={searchParams} />}
        initialWebhookEnabled={data.webhook_enabled}
        initialWebhookUrl={webhookData?.url ?? ""}
        initialWebhookSecret={webhookData?.secret ?? ""}
      />
    </main>
  );
}

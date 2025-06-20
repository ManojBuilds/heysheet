import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { FormTabs } from "./form-tabs";
import { parseISO } from "date-fns";
import { FormDetails } from "@/types/form-details";

export default async function EndpointDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  const { from, to } = await searchParams;
  const fromDate = from
    ? parseISO(from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = to ? parseISO(to) : new Date();

  if (!userId) {
    return redirect("/sign-in");
  }

  const supabase = await createClient();

  const [analyticsRes, formRes] = await Promise.all([
    supabase.rpc("form_analytics_range", {
      id,
      from_date: fromDate.toISOString(),
      to_date: toDate.toISOString(),
    }),
    supabase
      .from("forms")
      .select("*, slack_account:slack_account_id(*), file_upload")
      .eq("id", id)
      .eq("user_id", userId)
      .single(),
  ]);

  const { data: analytics  } = analyticsRes;
  const { data, error: formError } = formRes;

  if (formError || !data) {
    return notFound();
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const endpointUrl = `${appUrl}/api/submit/${id}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={"/forms"} className="inline-block">
        <Button leftIcon={<ArrowLeft />}>Forms</Button>
      </Link>
      <FormTabs
        defaultTab="details"
        id={id}
        data={data as FormDetails}
        appUrl={appUrl}
        endpointUrl={endpointUrl}
        analytics={analytics}
      />
      {/* TODO: Add support for embedded forms */}
      {/* <iframe
      src="http://localhost:3000/f/e00834d8-acab-423b-9474-489bc8b78282"
      width="100%"
      height="600"
      style={{ border: "none" }}
    ></iframe> */}
    </div>
  );
}

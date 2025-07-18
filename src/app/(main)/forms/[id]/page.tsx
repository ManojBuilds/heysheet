import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FormTabs } from "./form-tabs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { FormDetailsFetcher } from "./form-details-fetcher";
import { FormAnalytics } from "./form-analytics";
import { Skeleton } from "@/components/ui/skeleton";

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
  return (
    <main className="max-w-3xl mx-auto space-y-6">
      <nav>
        <Link href={"/forms"} className="inline-block">
          <Button leftIcon={<ArrowLeft />}>Forms</Button>
        </Link>
      </nav>
      <FormTabs
        defaultTab="overview"
        formAnalytics={<FormAnalytics id={id} searchParams={searchParams} />}
      >
        <Suspense fallback={<Skeleton className="w-full h-12 rounded" />}>
          <FormDetailsFetcher id={id} />
        </Suspense>
      </FormTabs>
    </main>
  );
}


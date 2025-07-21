import { getFormDetails } from "@/lib/form";
import { notFound } from "next/navigation";
import { parseISO, startOfMonth } from "date-fns";
import DateFilter from "@/components/dashboard/date-filter";
import FormAnalyticsStats from "@/components/form-analytics/FormAnalyticsStats";
import FormAnalyticsCharts from "@/components/form-analytics/FormAnalyticsCharts";
import { Suspense } from "react";
import FormAnalyticsStatsSkeleton from "@/components/form-analytics/FormAnalyticsStatsSkeleton";
import FormAnalyticsChartsSkeleton from "@/components/form-analytics/FormAnalyticsChartsSkeleton";

export default async function FormAnalyticsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { from?: string; to?: string };
}) {
  const formId = params.id;
  const form = await getFormDetails(formId);

  if (!form) {
    return notFound();
  }

  const { from, to } = searchParams;
  const fromDate = from ? parseISO(from) : startOfMonth(new Date());
  const toDate = to ? parseISO(to) : new Date();

  const fromDateIso = fromDate.toISOString();
  const toDateIso = toDate.toISOString();

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2 items-center">
        <h2 className="sm:text-lg">Submission Analytics</h2>
        <DateFilter />
      </div>
      <Suspense fallback={<FormAnalyticsStatsSkeleton />}>
        <FormAnalyticsStats
          formId={id}
          fromDate={fromDateIso}
          toDate={toDateIso}
        />
      </Suspense>
      <Suspense fallback={<FormAnalyticsSubmissionsOverTimeSkeleton />}>
        <FormAnalyticsSubmissionsOverTime
          formId={id}
          fromDate={fromDateIso}
          toDate={toDateIso}
        />
      </Suspense>
      <Suspense fallback={<FormAnalyticsChartsSkeleton />}>
        <FormAnalyticsCharts
          formId={id}
          fromDate={fromDateIso}
          toDate={toDateIso}
        />
      </Suspense>
    </div>
  );
};

import DateFilter from "@/components/dashboard/date-filter";
import { Suspense } from "react";
import FormAnalyticsStats from "@/components/form-analytics/FormAnalyticsStats";
import FormAnalyticsStatsSkeleton from "@/components/form-analytics/FormAnalyticsStatsSkeleton";
import FormAnalyticsSubmissionsOverTime from "@/components/form-analytics/FormAnalyticsSubmissionsOverTime";
import FormAnalyticsSubmissionsOverTimeSkeleton from "@/components/form-analytics/FormAnalyticsSubmissionsOverTimeSkeleton";
import FormAnalyticsCharts from "@/components/form-analytics/FormAnalyticsCharts";
import FormAnalyticsChartsSkeleton from "@/components/form-analytics/FormAnalyticsChartsSkeleton";
import { parseISO, startOfWeek } from "date-fns";

export const FormAnalytics = async ({
  id,
  searchParams,
}: {
  id: string;
  searchParams: Promise<{ from?: string; to?: string }>;
}) => {
  const { from, to } = await searchParams;
  const fromDate = from
    ? parseISO(from)
    : startOfWeek(new Date(), { weekStartsOn: 1 });
  const toDate = to ? parseISO(to) : new Date();

  const fromDateIso = fromDate.toISOString();
  const toDateIso = toDate.toISOString();

  console.log("FormAnalytics props:", { id, fromDateIso, toDateIso });

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

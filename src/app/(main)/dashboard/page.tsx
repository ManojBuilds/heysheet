import { ChartAreaInteractive } from "@/components/dashboard/chart-area";
import CreateFormModal from "@/components/CreateFormModal";
import PageHeader from "@/components/pages/page-header";
import Topforms from "@/components/dashboard/top-forms";
import { parseISO, startOfMonth } from "date-fns";
import DateFilter from "@/components/dashboard/date-filter";
import { Suspense } from "react";
import DashboardStats from "./dashboard-stats";
import DashboardCharts from "./DashboardCharts";
import DashboardStatsSkeleton from "./dashboard-stats-skeleton";
import ChartAreaSkeleton from "@/components/dashboard/chart-area-skeleton";
import TopFormsSkeleton from "@/components/dashboard/top-forms-skeleton";
import DashboardChartsSkeleton from "./DashboardChartsSkeleton";
import { notFound } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const fromDate = from ? parseISO(from) : startOfMonth(new Date());
  const toDate = to ? parseISO(to) : new Date();

  const fromDateIso = fromDate.toISOString();
  const toDateIso = toDate.toISOString();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Dashboard"}
        action={<CreateFormModal />}
      />
      <DateFilter />
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats fromDate={fromDateIso} toDate={toDateIso} />
      </Suspense>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Suspense fallback={<ChartAreaSkeleton />}>
            <ChartAreaInteractive fromDate={fromDateIso} toDate={toDateIso} />
          </Suspense>
        </div>
        <Suspense fallback={<TopFormsSkeleton />}>
          <Topforms fromDate={fromDateIso} toDate={toDateIso} />
        </Suspense>
      </div>
      <Suspense fallback={<DashboardChartsSkeleton />}>
        <DashboardCharts fromDate={fromDateIso} toDate={toDateIso} />
      </Suspense>
    </div>
  );
}

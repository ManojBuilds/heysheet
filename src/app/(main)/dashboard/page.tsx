import { auth, currentUser } from "@clerk/nextjs/server";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area";
import CreateFormModal from "@/components/CreateFormModal";
import PageHeader from "@/components/pages/page-header";
import Topforms from "@/components/dashboard/top-forms";
import { parseISO, startOfWeek } from "date-fns";
import DateFilter from "@/components/dashboard/date-filter";
import { getGoogleAccounts } from "@/actions";
import AllowGooglePermissions from "@/components/AllowGooglePermissions";
import { Suspense } from "react";
import DashboardStats from "./dashboard-stats";
import DashboardCharts from "./DashboardCharts";
import DashboardStatsSkeleton from "./dashboard-stats-skeleton";
import ChartAreaSkeleton from "@/components/dashboard/chart-area-skeleton";
import TopFormsSkeleton from "@/components/dashboard/top-forms-skeleton";
import DashboardChartsSkeleton from "./DashboardChartsSkeleton";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/");
  }
  const user = await currentUser()
  const { from, to } = await searchParams;
  // const googleAccounts = await getGoogleAccounts(userid || "");
  // const isGoogleAccountConnected = !!googleAccounts.length;
  const fromDate = from
    ? parseISO(from)
    : startOfWeek(new Date(), { weekStartsOn: 1 });
  const toDate = to ? parseISO(to) : new Date();

  const fromDateIso = fromDate.toISOString();
  const toDateIso = toDate.toISOString();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={user?.firstName ? `Holla, ${user.firstName}` : "Dashboard"}
        action={<CreateFormModal />}
      />
      {/* Always show dashboard content, regardless of Google account connection */}
      <DateFilter />
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats fromDate={fromDateIso} toDate={toDateIso} />
      </Suspense>
      <div className="inline-flex gap-4">
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
      {/* Optionally, show AllowGooglePermissions if not connected, but do not block dashboard */}
      {/* {!isGoogleAccountConnected && <AllowGooglePermissions className="pt-12" />} */}
    </div>
  );
}

import StatisticCard from "@/components/dashboard/statistic-card";
import { getDashboardStats } from "@/lib/data";
import { auth } from "@clerk/nextjs/server";
import { FilesIcon, InboxIcon, ToggleRightIcon } from "lucide-react";

export default async function DashboardStats({ fromDate, toDate }: { fromDate: string, toDate: string }) {
  const { userId } = await auth();
  const { activeForms,
    totalForms, totalSubmissions
  } = await getDashboardStats({
    userId: userId as string,
    fromDate,
    toDate
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatisticCard
        icon={FilesIcon}
        title="Total forms"
        value={totalForms}
        tooltipContent="The total number of forms you've created on your account."
      />
      <StatisticCard
        icon={InboxIcon}
        title="Total submissions"
        value={totalSubmissions}
        tooltipContent="The total number of submissions received across all your forms."
      />
      <StatisticCard
        icon={ToggleRightIcon}
        title="Active forms"
        value={activeForms}
        tooltipContent="Forms that are enabled and can receive submissions."
      />
    </div>
  );
}

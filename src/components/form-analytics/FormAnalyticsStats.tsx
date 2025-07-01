import { currentUser } from "@clerk/nextjs/server";
import { getDashboardStats } from "@/lib/data";
import StatisticCard from "@/components/dashboard/statistic-card";
import { InboxIcon } from "lucide-react";

export default async function FormAnalyticsStats({
  formId,
  fromDate,
  toDate,
}: {
  formId: string;
  fromDate: string;
  toDate: string;
}) {
  const user = await currentUser();
  const { totalSubmissions } = await getDashboardStats({
    userId: user?.id || "",
    fromDate,
    toDate,
    formId,
  });

  return (
    <StatisticCard
      icon={InboxIcon}
      title="Total submissions"
      value={totalSubmissions}
      tooltipContent="The total number of submissions received for this form."
    />
  );
}

import { currentUser } from "@clerk/nextjs/server";
import { getSubmissionsOverTime } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChartAreaContent from "@/components/dashboard/chart-area-content";

export default async function FormAnalyticsSubmissionsOverTime({
  formId,
  fromDate,
  toDate,
}: {
  formId: string;
  fromDate: string;
  toDate: string;
}) {
  const user = await currentUser();
  const submissionsOverTime = await getSubmissionsOverTime({
    userId: user?.id || "",
    fromDate,
    toDate,
    formId,
  });

  return (
    <Card className="pt-0 bg-transparent">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Submissions Over Time</CardTitle>
          <CardDescription className="sr-only">Interactive area chart showing submission trends</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartAreaContent data={submissionsOverTime || []} />
      </CardContent>
    </Card>
  );
}

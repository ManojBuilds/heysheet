
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig
} from "@/components/ui/chart";
import { auth } from "@clerk/nextjs/server";
import { getSubmissionsOverTime } from "@/lib/data";
import ChartAreaContent from "./chart-area-content";

export const description = "An interactive area chart";

const chartConfig = {
  count: {
    label: "Submissions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export async function ChartAreaInteractive({ fromDate, toDate }: { fromDate: string, toDate: string }) {
  const { userId } = await auth();
  const data = await getSubmissionsOverTime({
    userId: userId as string,
    fromDate,
    toDate
  })
  return (
    <Card className="pt-0 bg-transparent">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Submissions Over Time</CardTitle>
          <CardDescription className="sr-only">Interactive area chart showing submission trends</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartAreaContent data={data} />
      </CardContent>
    </Card>
  );
}

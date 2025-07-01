import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormAnalyticsSubmissionsOverTimeSkeleton() {
  return (
    <Card className="pt-0 bg-transparent">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Submissions Over Time</CardTitle>
          <CardDescription className="sr-only">Interactive area chart showing submission trends</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

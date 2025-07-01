import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxIcon } from "lucide-react";

export default function FormAnalyticsStatsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
        <InboxIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <Skeleton className="h-8 w-24" />
        </div>
          <Skeleton className="h-4 w-32 mt-1" />
      </CardContent>
    </Card>
  );
}

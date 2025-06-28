import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChartAreaSkeleton() {
  return (
    <Card className="pt-0 bg-transparent w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <Skeleton className="w-full h-[320px] rounded-lg" />
      </CardContent>
    </Card>
  );
}

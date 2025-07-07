import { Skeleton } from "@/components/ui/skeleton";

const IntegrationCardSkeleton = () => (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
    <Skeleton className="h-9 w-24" />
  </div>
);

export const IntegrationsListSkeleton = () => {
  return (
    <div className="space-y-4 mt-6">
      <IntegrationCardSkeleton />
      <IntegrationCardSkeleton />
      <IntegrationCardSkeleton />
    </div>
  );
};
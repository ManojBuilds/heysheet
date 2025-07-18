import { FormCardSkeleton } from "@/components/FormCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function FormListSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 xl:grid-cols-3 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <FormCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

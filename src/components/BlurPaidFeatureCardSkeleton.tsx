import { Skeleton } from "./ui/skeleton";

export const BlurPaidFeatureCardSkeleton = () => <div className="absolute inset-0 z-10 dark:bg-black/50 backdrop-blur-[2px] rounded-xl flex flex-col justify-center items-center text-center p-6 space-y-2">
    <Skeleton className="h-6 w-40" />
    <Skeleton className="h-4 w-64" />
    <div className="flex flex-col gap-1 mt-2">
        {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-52" />
        ))}
    </div>
    <Skeleton className="h-10 w-36 mt-4" />
</div>

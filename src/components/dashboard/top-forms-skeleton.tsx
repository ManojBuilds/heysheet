import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function TopFormsSkeleton() {
  return (
    <Card className="bg-transparent w-full max-w-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 justify-between capitalize">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 justify-between text-sm"
          >
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

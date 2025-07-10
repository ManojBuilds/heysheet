import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardChartsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-transparent min-h-full w-full">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center justify-between gap-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-16" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {[...Array(5)].map((_, j) => (
                            <div
                                key={j}
                                className="flex items-center justify-between gap-2 px-4 py-1.5 rounded text-sm"
                            >
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

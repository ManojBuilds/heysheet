"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReusableChart({
  title,
  data,
}: { title: string, data: { key: string, value: string | number }[] | undefined }) {
  const isEmpty = !Array.isArray(data) || data.length === 0;

  return (
    <Card className="bg-transparent min-h-full w-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between gap-2">
          <h2>{title}</h2>
          <p className="text-muted-foreground uppercase font-medium text-xs">
            visitors
          </p>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {isEmpty ? (
          <div className="text-sm text-muted-foreground px-4 py-6 text-center">
            No data available
          </div>
        ) : (
          data?.map(({ key, value }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-2 px-4 py-1.5 rounded text-sm bg-muted"
            >
              <p className="capitalize">{key}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

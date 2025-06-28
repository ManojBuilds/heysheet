'use client'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

const chartConfig = {
    count: {
        label: "Submissions",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;
export default function ChartAreaContent({ data }: { data: { day: string, count: number }[] }) {
    return (
        <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
        >
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="fillSubmission" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--chart-2)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--chart-2)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        });
                    }}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(value) => {
                                return new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                            indicator="dot"
                        />
                    }
                />
                <Area
                    dataKey="count"
                    type="natural"
                    fill="url(#fillSubmission)"
                    stroke="var(--chart-2)"
                    stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
        </ChartContainer>
    )
}

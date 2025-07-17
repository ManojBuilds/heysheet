import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import TooltipWrapper from "../TooltipWrapper";

interface StatisticCardProps {
  className?: string;
  icon: LucideIcon;
  title: string;
  value: ReactNode;
  tooltipContent: string;
}

const StatisticCard = ({
  className,
  icon: Icon,
  title,
  value,
  tooltipContent,
}: StatisticCardProps) => {
  return (
    <Card className={cn()}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center p-2 bg-zinc-200 dark:bg-zinc-700 rounded-full">
            <Icon className="opacity-50 text-zinc-700 dark:text-zinc-300" strokeWidth={1.5} size={20} />
          </div>
          <h3 className="text-zinc-600 dark:text-zinc-400">{title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipWrapper content={tooltipContent}>
          <h3 className="font-semibold text-xl sm:text-2xl lg:text-4xl inline-block text-zinc-900 dark:text-zinc-100">
            {value}
          </h3>
        </TooltipWrapper>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;

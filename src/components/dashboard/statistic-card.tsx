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
    <Card className={cn("bg-transparent gap-2", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center p-2 bg-secondary rounded-full">
            <Icon className="opacity-50" strokeWidth={1.5} size={20} />
          </div>
          <h3 className="text-muted-foreground">{title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipWrapper content={tooltipContent}>
          <h3 className="font-semibold text-xl sm:text-2xl lg:text-4xl inline-block">
            {value}
          </h3>
        </TooltipWrapper>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;

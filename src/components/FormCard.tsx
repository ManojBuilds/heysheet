"use client";

import { Button } from "./ui/button";
import {
  Clock,
  FileText,
  Wrench,
  BarChart3,
  FileSpreadsheet,
  Paintbrush2Icon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import TooltipWrapper from "./TooltipWrapper";

type FormCardProps = {
  form: {
    id: string;
    title: string;
    sheet_name: string;
    created_at: string;
    submission_count: number;
  };
};

export function FormCard({ form }: FormCardProps) {
  return (
    <Card className="bg-transparent hover:shadow-accent relative">
      <CardHeader className="py-0">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-foreground flex-1">
              {form.title}
            </h2>
            {/* <Link */}
            {/*   target="_blank" */}
            {/*   href={`/form-builder/${form.id}`} */}
            {/*   className="z-10" */}
            {/* > */}
            {/*   <TooltipWrapper */}
            {/*     content={"Build beautiful form with form builder"} */}
            {/*   > */}
            {/*     <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full"> */}
            {/*       <Paintbrush2Icon strokeWidth={1.5} size={18} /> */}
            {/*     </div> */}
            {/*   </TooltipWrapper> */}
            {/* </Link> */}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 ">
        <div className="px-6 space-y-2.5 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            {form.sheet_name}
          </div>

          <div className="flex items-center gap-1 text-nowrap text-sm ">
            <BarChart3 className="w-4 h-4" />
            {form.submission_count || 0} submissions
          </div>
          <div className="flex items-center gap-1.5 text-nowrap text-sm ">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(new Date(form.created_at), {
              addSuffix: true,
            })}
          </div>
        </div>
        <Link href={`/forms/${form.id}`} className="absolute inset-0" />
      </CardContent>
    </Card>
  );
}

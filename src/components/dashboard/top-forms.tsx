import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRightIcon, MousePointerClick } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { TopFormsAnalyticsData } from "@/types/form-builder";

const Topforms = ({ forms }: { forms: TopFormsAnalyticsData[] }) => {
  console.log("forms", forms);
  return (
    <Card className="bg-transparent w-full max-w-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 justify-between capitalize">
          <h3>Top Forms by Submissions</h3>
          <p className="text-muted-foreground text-sm">Submissions</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {forms?.length > 0 ? (
          forms.map((form, i) => (
            <div
              key={form.id}
              className="flex items-center gap-2 justify-between text-sm"
            >
              <Link href={`/forms/${form.id}`}>
                <p className="font-semibold">
                  <span className="text-muted-foreground">{i + 1}.</span>{" "}
                  {form.title}
                </p>
              </Link>
              <p className="flex items-center gap-2">
                <MousePointerClick
                  size={18}
                  strokeWidth={1.5}
                  className="text-muted-foreground"
                />
                {form.submission_count}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm italic text-center">
            No forms with submissions yet.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={"/forms"}
          className={buttonVariants({
            variant: "secondary",
            className:
              "flex items-center gap-2 w-full capitalize font-semibold",
          })}
        >
          view all forms
          <ArrowRightIcon />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Topforms;

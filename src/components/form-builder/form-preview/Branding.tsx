import { cn } from "@/lib/utils";
import { FormData } from "@/types/form-builder";
import Link from "next/link";

const Branding = ({
  formData,
  className,
}: {
  formData: FormData;
  className?: string;
}) => {
  const theme = formData.theme;

  return (
    <div
      className={cn("flex-shrink-0 w-fit mx-auto", className)}
      style={{ fontFamily: theme.font }}
    >
      <Link
        href={process.env.NEXT_PUBLIC_APP_URL!}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Build forms with HeySheet"
        className={cn(
          "flex items-center gap-2 px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
          `rounded-${theme.radius}`,
        )}
        style={{
          backgroundColor: theme.backgroundSecondary,
          border: `1px solid ${theme.border}`,
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: theme.textSecondary }}
        >
          Powered by{" "}
          <span style={{ color: theme.primary }} className="font-bold">
            Heysheet
          </span>
        </p>
      </Link>
    </div>
  );
};

export default Branding;

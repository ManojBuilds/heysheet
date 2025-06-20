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
    <div className={cn("flex-shrink-0 w-fit mx-auto", className)}>
      <Link
        href={process.env.NEXT_PUBLIC_APP_URL!}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Build forms with HeySheet"
        className={cn(
          "flex items-center gap-2 px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg !font-main",
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
          Want a form like this?{" "}
          <span style={{ color: theme.primary }}>Build with HeySheet</span> 🚀
        </p>
      </Link>
    </div>
  );
};

export default Branding;

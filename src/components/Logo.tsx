import { ZapIcon } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/"} className="inline-flex items-center gap-1">
      {/* <ZapIcon className="text-primary"/> */}
      {/* 🦍 */}
      <span className="font-semibold text-2xl font-logo">heysheet</span>
    </Link>
  );
};

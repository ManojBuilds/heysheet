import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Logo = ({className}: {className?: string}) => {
  return (
    <Link href={"/"} className={cn("inline-flex items-center", className)}>
      {/* <ZapIcon className="text-primary"/> */}
      {/* 🦍 */}
      {/* <span className="font-semibold text-2xl font-logo">heysheet</span> */}
      <div className="h-8 aspect-square grid place-items-center relative">
        <Image
          src={'/logo.png'}
          alt="Heysheet Logo"
          fill
          className="w-full h-full scale-110"
        />
      </div>

      <span className="font-bold text-2xl">heysheet</span>
    </Link>
  );
};

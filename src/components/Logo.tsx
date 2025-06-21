import { ZapIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href={"/"} className="inline-flex items-center gap-1">
      {/* <ZapIcon className="text-primary"/> */}
      {/* 🦍 */}
      {/* <span className="font-semibold text-2xl font-logo">heysheet</span> */}
      <Image
      src={'/logo.png'}
      alt="Heysheet Logo"
      width={177}
      height={40}
      className="object-contain h-10"
      />
    </Link>
  );
};

import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href={"/"} className="inline-flex items-center">
      {/* <ZapIcon className="text-primary"/> */}
      {/* 🦍 */}
      {/* <span className="font-semibold text-2xl font-logo">heysheet</span> */}
      <div className="h-16 aspect-square grid place-items-center relative">
        <Image
          src={'/logo.png'}
          alt="Heysheet Logo"
          fill
          className="w-full h-full scale-110"
        />
      </div>

      <span className="font-bold text-2xl -ml-3">heysheet</span>
    </Link>
  );
};

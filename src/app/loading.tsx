"use client";
import Image from "next/image";

export default function Loading() {
 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-2xl">
      <div className="relative w-24 h-24 ">
        <Image
          src="https://ik.imagekit.io/q3ksr5fk3/logo.png?updatedAt=1752807239894"
          alt="Logo"
          className="animate-pulse object-contain"
          fill
        />
      </div>
    </div>
  );
}

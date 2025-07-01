"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/30 backdrop-blur-2xl">
      <div className="relative w-24 h-24 mb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          className="animate-pulse object-contain"
          fill
        />
      </div>
      <div className="w-64">
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}

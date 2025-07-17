import { Geist_Mono, Work_Sans } from "next/font/google";

export const dmSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-geist-mono",
});

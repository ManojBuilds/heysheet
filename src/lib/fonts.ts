import { Inter, Roboto, Poppins } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";

export const fonts = {
  Inter: Inter({ subsets: ["latin"], variable: "--font-inter" }),
  Roboto: Roboto({ subsets: ["latin"], variable: "--font-roboto" }),
  Poppins: Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ['400', '600'] }),
  "Plus_Jakarta_Sans": Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" }),
};

import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Bricolage_Grotesque,
} from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const sans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const grotesque = Bricolage_Grotesque({
  variable: "--font-grotesque",

  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FormSync - Connect Forms to Google Sheets",
  description:
    "Easily connect your forms to Google Sheets in seconds. No code required.",
  icons: {
    icon: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html lang="en">
        <body
          className={`${sans.variable} ${grotesque.variable}  antialiased`}
        >
          <main>{children}</main>
          <Toaster
            className="!font-main"
            closeButton
            expand={false}
            position="top-center"
          />
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
        </body>
      </html>
    </Provider>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import UpgradeModal from "@/components/UpgradeModal";
import { config } from "@/config";
import { dmSans } from "@/components/ui/fonts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Heysheet: Submits any Google Forms to Google Sheets and Notion. Instantly.",
  description:
    "Submits any Google Forms to Google Sheets and Notion. Instantly. Heysheet is the ultimate form backend for Google Sheets & Notion. Streamline your data collection with real-time sync, a visual form builder, and robust analytics. A powerful alternative to SheetMonkey and NotionMonkey.",
  keywords: 'heysheet, google forms, google sheets, notion, form backend, form builder, real-time sync, sheetmonkey alternative, notionmonkey alternative, serverless forms, data collection, form submissions',
  icons: {
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(config.appUrl),

  openGraph: {
    title: "Heysheet: Submits any Google Forms to Google Sheets and Notion. Instantly.",
    description:
      "Submits any Google Forms to Google Sheets and Notion. Instantly. Heysheet is the ultimate form backend for Google Sheets & Notion. Streamline your data collection with real-time sync, a visual form builder, and robust analytics. A powerful alternative to SheetMonkey and NotionMonkey.",
    url: config.appUrl,
    siteName: "Heysheet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Heysheet – Form backend that syncs with Google Sheets & Notion",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Heysheet: Submits any Google Forms to Google Sheets and Notion. Instantly.",
    description:
      "Submits any Google Forms to Google Sheets and Notion. Instantly. Heysheet is the ultimate form backend for Google Sheets & Notion. Streamline your data collection with real-time sync, a visual form builder, and robust analytics. A powerful alternative to SheetMonkey and NotionMonkey.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${dmSans.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <main>{children}</main>
            <UpgradeModal />
            <Toaster
              className={dmSans.className}
              closeButton
              expand={false}
              position="top-center"
            />
            <Analytics />
            <SpeedInsights />
            <NextTopLoader
              color="#00c950"
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
          </ThemeProvider>
        </body>
      </html>
    </Provider>
  );
}

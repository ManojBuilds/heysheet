import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import UpgradeModal from "@/components/UpgradeModal";
import { config } from "@/config";
import { dmSans } from "@/components/ui/fonts";

export const metadata: Metadata = {
  title: "Forms that sync with Google Sheets Instantly.",
  description:
    "HeySheet lets you build beautiful forms that update your spreadsheets in real time. No complex integrations, no delays.",
  icons: {
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(config.appUrl),

  openGraph: {
    title: "HeySheet – Connect Your Forms to Google Sheets",
    description: "Easily sync form submissions to Google Sheets with no code.",
    url: config.appUrl,
    siteName: "HeySheet",
    images: [
      {
        url: "/og-image.png", // Recommended: 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: "HeySheet Preview Image",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HeySheet – Connect Your Forms to Google Sheets",
    description: "Easily sync form submissions to Google Sheets with no code.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased`}>
        <Provider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <main>{children}</main>
            <UpgradeModal />
            <Toaster
              className={dmSans.className}
              closeButton
              expand={false}
              position="top-center"
            />
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
        </Provider>
      </body>
    </html>
  );
}

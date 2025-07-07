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

export const metadata: Metadata = {
  title: "Heysheet – Form Backend for Google Sheets & Notion",
  description:
    "Post your HTML forms to a simple endpoint and get submissions in Google Sheets or Notion – with file uploads, analytics, email & Slack notifications, and a visual builder.",
  icons: {
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(config.appUrl),

  openGraph: {
    title: "Heysheet – Form Backend for Google Sheets & Notion",
    description:
      "Plug in an API endpoint to your form and get submissions in Google Sheets or Notion. Built-in support for analytics, file uploads, and alerts.",
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
    title: "Heysheet – Developer-first Form Backend",
    description:
      "Build forms with an endpoint that sends data to Google Sheets or Notion – plus analytics, uploads & notifications.",
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

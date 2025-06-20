import type { Metadata } from "next";
import { Outfit, Pacifico } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import UpgradeModal from "@/components/UpgradeModal";

const outfit = Outfit({
  subsets: ["latin"],
});

const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: "400",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} ${pacifico.variable} antialiased`}>
        <Provider>
          <ThemeProvider>
            <main>{children}</main>
            <UpgradeModal />
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
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

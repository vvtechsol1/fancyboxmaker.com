import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import Tracker from "@/components/analytics/Tracker";
import Presence from "@/components/analytics/Presence";
import ScrollAnimations from "@/components/anim/ScrollAnimations";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "custom boxes",
    "custom printed boxes",
    "custom packaging",
    "custom mailer boxes",
    "rigid boxes",
    "kraft boxes",
    "product packaging printing",
    "wholesale custom boxes",
    "FancyBoxMaker",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white" suppressHydrationWarning>
        <CartProvider>
          <Tracker />
          <Presence />
          <ScrollAnimations />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <div className="h-14 lg:hidden" aria-hidden />
          <MobileTabBar />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import ChromeGate from "@/components/layout/ChromeGate";
import Tracker from "@/components/analytics/Tracker";
import Presence from "@/components/analytics/Presence";
import ScrollAnimations from "@/components/anim/ScrollAnimations";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE.url),
    title: { default: s.seoTitle, template: `%s | ${s.brandName}` },
    description: s.seoDescription,
    keywords: [
      "custom boxes",
      "custom printed boxes",
      "custom packaging",
      "custom mailer boxes",
      "rigid boxes",
      "kraft boxes",
      "product packaging printing",
      "wholesale custom boxes",
      s.brandName,
    ],
    openGraph: {
      type: "website",
      siteName: s.brandName,
      title: s.seoTitle,
      description: s.seoDescription,
      url: SITE.url,
      locale: SITE.locale,
    },
    twitter: { card: "summary_large_image", title: s.brandName, description: s.seoDescription },
    robots: { index: true, follow: true },
    ...(s.favicon ? { icons: { icon: s.favicon } } : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  // Runtime theme — overrides the globals.css @theme defaults from admin settings.
  const themeVars = `:root{--color-brand:${s.colorPrimary};--color-brand-dark:${s.colorPrimaryDark};--color-brand-soft:color-mix(in srgb, ${s.colorPrimary} 14%, white);--color-green:${s.colorSecondary};--color-cream:${s.colorBg};--color-ink:${s.colorInk};}`;

  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white" suppressHydrationWarning>
        <style dangerouslySetInnerHTML={{ __html: themeVars }} />
        <CartProvider>
          <Tracker />
          <Presence />
          <ScrollAnimations />
          <ChromeGate><Header settings={s} /></ChromeGate>
          <main className="flex-1">{children}</main>
          <ChromeGate>
            <Footer settings={s} />
            <div className="h-14 lg:hidden" aria-hidden />
            <MobileTabBar />
          </ChromeGate>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

"use client";

import { usePathname } from "next/navigation";

/** Hides the store chrome (header/footer/tab-bar) on the admin dashboard,
 * which renders its own full-screen sidebar layout. */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}

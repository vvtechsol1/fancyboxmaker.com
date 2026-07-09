"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";
import { detectDevice } from "@/lib/device";

/** Records a pageview (with device type) on every route change; skips /admin. */
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    track("view", pathname, undefined, detectDevice());
  }, [pathname]);
  return null;
}

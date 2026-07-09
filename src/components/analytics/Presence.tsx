"use client";

import { useEffect } from "react";
import { detectDevice } from "@/lib/device";

/**
 * Sends a lightweight heartbeat every 15s so the admin can see how many
 * visitors are on the store RIGHT NOW, split by mobile vs desktop.
 * Skips the /admin area so the owner isn't counted as a customer.
 */
export default function Presence() {
  useEffect(() => {
    let sid = sessionStorage.getItem("cb_sid");
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("cb_sid", sid);
    }
    const device = detectDevice();

    const beat = () => {
      if (window.location.pathname.startsWith("/admin")) return;
      const body = JSON.stringify({ sid, device });
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/presence", new Blob([body], { type: "application/json" }));
        } else {
          fetch("/api/presence", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
        }
      } catch {
        /* ignore */
      }
    };

    beat();
    const id = setInterval(beat, 15_000);
    const onVisible = () => { if (document.visibilityState === "visible") beat(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}

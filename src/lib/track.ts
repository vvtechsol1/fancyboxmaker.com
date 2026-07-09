// Client-side event tracking → POST /api/track.
// Uses sendBeacon so the event is delivered even when the click immediately
// navigates away (e.g. router.push to a category, or opening WhatsApp).
export function track(type: "view" | "search" | "order", label: string, product?: string, device?: string): void {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ type, label, product, device });
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

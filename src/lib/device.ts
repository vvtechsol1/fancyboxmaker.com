// Detect whether the current visitor is on a mobile/tablet or a desktop.
// Runs on the client (uses the real userAgent + touch capability — nothing faked).
export type Device = "mobile" | "desktop";

export function detectDevice(): Device {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  const phone = /Mobi|Android|iPhone|iPod|Windows Phone|IEMobile|BlackBerry|Opera Mini/i.test(ua);
  const tablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua));
  return phone || tablet ? "mobile" : "desktop";
}

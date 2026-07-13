"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile CAPTCHA widget.
 * SITE_KEY below is Cloudflare's public TEST key (always passes) — replace it with
 * the real widget's site key for production protection. The backend verifies the
 * token in src/lib/turnstile.ts using TURNSTILE_SECRET_KEY.
 */
const SITE_KEY = "1x00000000000000000000AA";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const cb = useRef(onVerify);
  cb.current = onVerify;

  useEffect(() => {
    let cancelled = false;
    function render() {
      if (cancelled || !window.turnstile || !ref.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => cb.current(token),
        "error-callback": () => cb.current(""),
        "expired-callback": () => cb.current(""),
        theme: "light",
      });
    }

    if (window.turnstile) {
      render();
    } else {
      const id = "cf-turnstile-script";
      let poll: ReturnType<typeof setInterval> | null = null;
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        s.async = true;
        s.defer = true;
        s.onload = render;
        document.head.appendChild(s);
      }
      poll = setInterval(() => {
        if (window.turnstile) {
          if (poll) clearInterval(poll);
          render();
        }
      }, 200);
      return () => {
        cancelled = true;
        if (poll) clearInterval(poll);
      };
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={ref} className="cf-turnstile min-h-[65px]" />;
}

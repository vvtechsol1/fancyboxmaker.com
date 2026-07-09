"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="border-b border-line bg-ink">
      <div className="container-x flex flex-col items-center gap-6 py-12 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h3 className="text-2xl font-extrabold text-white font-display">Packaging tips & exclusive deals</h3>
          <p className="mt-1 text-sm text-white/60">Subscribe for design ideas, new box styles and 10% off your first order.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
          className="flex w-full max-w-md items-center gap-2"
        >
          {done ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-3 text-sm font-medium text-white">
              <CheckCircle2 size={18} className="text-[var(--color-wa)]" /> Thanks for subscribing!
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
              <button className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark">
                <Send size={16} /> Join
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

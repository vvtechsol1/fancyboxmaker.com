"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { SITE } from "@/lib/site";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");

  function track(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Hi ${SITE.name}! I'd like to track my custom boxes order.\n\n📦 Order ID: ${orderId || "(not sure)"}\n📞 Phone: ${phone || "(not provided)"}`;
    window.open(`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div className="container-x py-12">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand"><PackageSearch size={26} /></span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink font-display">Track your order</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Enter your order details and we'll pull up your status on WhatsApp right away.
        </p>

        <form onSubmit={track} className="mt-8 space-y-3 text-left">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Order ID</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. FBM-10245"
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Phone number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
            />
          </div>
          <button className="h-12 w-full rounded-xl bg-[var(--color-wa)] text-sm font-semibold text-white transition hover:bg-[var(--color-wa-dark)]">
            Track on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

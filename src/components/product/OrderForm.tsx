"use client";

import { useState } from "react";
import { X, Minus, Plus, CheckCircle2, ShoppingBag } from "lucide-react";
import { SITE, formatPrice, whatsappFullOrder } from "@/lib/site";
import { track } from "@/lib/track";

export default function OrderForm({
  productTitle,
  price,
  variant,
  url,
  onClose,
}: {
  productTitle: string;
  price: number;
  variant?: string;
  url?: string;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const link = whatsappFullOrder({ productTitle, variant, qty, price, name, phone, city, address, url });
    track("order", productTitle);
    window.open(link, "_blank");
    setSent(true);
  }

  const field = "h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15";
  const total = price * qty;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink font-display">
            <ShoppingBag size={20} className="text-brand" /> {sent ? "Order placed!" : "Place your order"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface"><X size={20} /></button>
        </div>

        {sent ? (
          <div className="py-6 text-center">
            <CheckCircle2 size={56} className="mx-auto text-[var(--color-wa)]" />
            <h3 className="mt-4 text-lg font-bold text-ink">Almost done — send it on WhatsApp!</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">
              WhatsApp khul gaya hai aap ke order ke saath. Bas <b>Send</b> daba dein — hum stock confirm karke aap ko reply karenge.
            </p>
            <button onClick={onClose} className="mt-5 rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink hover:bg-surface">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            {/* summary */}
            <div className="rounded-xl border border-line bg-surface p-3">
              <p className="text-sm font-semibold text-ink">{productTitle}</p>
              {variant && <p className="text-xs text-ink-soft">Colour: {variant}</p>}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-bold">{qty}</span>
                  <button type="button" onClick={() => setQty(qty + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white"><Plus size={14} /></button>
                </div>
                <span className="text-lg font-extrabold text-ink">{formatPrice(total)}</span>
              </div>
            </div>

            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={field} />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (03XX-XXXXXXX)" inputMode="tel" className={field} />
            <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={field} />
            <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Complete delivery address" rows={2} className={`${field} h-auto py-2.5`} />

            <div className="flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2 text-xs text-brand">
              💵 Cash on Delivery · Hum WhatsApp par stock &amp; delivery confirm karenge
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wa)] py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-wa-dark)]">
              Confirm order on WhatsApp
            </button>
            <p className="text-center text-[11px] text-ink-soft">Order details {SITE.name} ko WhatsApp par chali jayengi.</p>
          </form>
        )}
      </div>
    </div>
  );
}

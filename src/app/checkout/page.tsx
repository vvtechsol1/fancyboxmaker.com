"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ref, setRef] = useState<string | null>(null);

  const [f, setF] = useState({
    name: "", email: "", phone: "", company: "",
    address: "", city: "", state: "", zip: "", country: "United States",
    notes: "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { name: f.name, email: f.email, phone: f.phone, company: f.company },
          shipping: { address: f.address, city: f.city, state: f.state, zip: f.zip, country: f.country },
          notes: f.notes,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setRef(data.ref);
        clear();
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error — please try again.");
    }
    setSaving(false);
  }

  if (ref) {
    return (
      <div className="container-x py-20 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-brand">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-ink font-display">Order request received!</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Your reference is <span className="font-bold text-ink">{ref}</span>. Our team will email you a final quote,
          a free 3D mockup and production timeline shortly.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Continue shopping</Link>
          <Link href="/track-order" className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand">Track order</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-extrabold text-ink font-display">Your cart is empty</h1>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Browse boxes</Link>
      </div>
    );
  }

  const field = "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft";

  return (
    <div className="container-x py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-ink font-display md:text-3xl">Checkout</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-bold text-ink">Contact</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className={label}>Full name *</label><input required value={f.name} onChange={set("name")} className={field} /></div>
              <div><label className={label}>Email *</label><input required type="email" value={f.email} onChange={set("email")} className={field} /></div>
              <div><label className={label}>Phone</label><input value={f.phone} onChange={set("phone")} className={field} inputMode="tel" /></div>
              <div><label className={label}>Company</label><input value={f.company} onChange={set("company")} className={field} /></div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-bold text-ink">Shipping address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2"><label className={label}>Street address</label><input value={f.address} onChange={set("address")} className={field} /></div>
              <div><label className={label}>City</label><input value={f.city} onChange={set("city")} className={field} /></div>
              <div><label className={label}>State / Province</label><input value={f.state} onChange={set("state")} className={field} /></div>
              <div><label className={label}>ZIP / Postal code</label><input value={f.zip} onChange={set("zip")} className={field} /></div>
              <div><label className={label}>Country</label><input value={f.country} onChange={set("country")} className={field} /></div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-bold text-ink">Project notes</h2>
            <textarea value={f.notes} onChange={set("notes")} rows={3} className={`${field} h-auto py-2`} placeholder="Dimensions, artwork, finishes, deadline — anything that helps us quote accurately." />
          </div>

          {error && <p className="rounded-lg bg-brand-soft px-4 py-2 text-sm font-medium text-brand">{error}</p>}
        </div>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-4 font-bold text-ink">Your order</h2>
          <div className="space-y-3">
            {items.map((i, idx) => (
              <div key={idx} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 text-ink-soft">
                  <span className="font-medium text-ink">{i.qty}× </span>{i.name}
                  {i.variantLabel ? <span className="block text-xs">{i.variantLabel}</span> : null}
                </span>
                <span className="shrink-0 font-semibold text-ink">{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-soft">Final total confirmed with your quote &amp; mockup. No payment is taken now.</p>
          <button disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
            {saving ? "Submitting…" : "Place order request"}
          </button>
        </aside>
      </form>
    </div>
  );
}

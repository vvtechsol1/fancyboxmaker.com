"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Sparkles, PenTool, Truck, BadgeCheck } from "lucide-react";
import { categories } from "@/data/taxonomy";

const MATERIALS = [
  "Kraft paperboard",
  "SBS cardboard",
  "E-flute corrugated",
  "Rigid greyboard",
  "Recycled kraft",
  "Not sure — advise me",
];
const FINISHES = ["Matte lamination", "Gloss lamination", "Soft-touch", "Foil stamping", "Embossing", "Spot UV", "Window cutout"];

export default function QuotePage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ref, setRef] = useState<string | null>(null);
  const [finishes, setFinishes] = useState<string[]>([]);

  const [f, setF] = useState({
    boxType: "", length: "", width: "", depth: "", unit: "in",
    quantity: "", material: "", color: "", artwork: "",
    name: "", email: "", phone: "", company: "", notes: "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));
  const toggleFinish = (x: string) =>
    setFinishes((prev) => (prev.includes(x) ? prev.filter((p) => p !== x) : [...prev, x]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, finishes }),
      });
      const data = await res.json();
      if (data.ok) setRef(data.ref);
      else setError(data.error || "Something went wrong.");
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
        <h1 className="mt-6 text-2xl font-extrabold text-ink font-display">Quote request received!</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Your reference is <span className="font-bold text-ink">{ref}</span>. A packaging specialist will email you a
          price, a free 3D mockup and turnaround — usually within a few hours.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Browse boxes</Link>
          <Link href="/" className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand">Back home</Link>
        </div>
      </div>
    );
  }

  const field = "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft";

  return (
    <div className="container-x py-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink font-display md:text-4xl">Get a Free Quote</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Tell us about your box and we&apos;ll send a price, a free 3D mockup and a production timeline. No commitment, no design fees.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-bold text-ink">Your box</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={label}>Box type</label>
                <select value={f.boxType} onChange={set("boxType")} className={field}>
                  <option value="">Select a box type…</option>
                  {categories.map((c) => (
                    <optgroup key={c.slug} label={c.name}>
                      {c.types.map((t) => (
                        <option key={t.slug} value={t.name}>{t.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Quantity</label>
                <input value={f.quantity} onChange={set("quantity")} className={field} placeholder="e.g. 500" inputMode="numeric" />
              </div>
              <div>
                <label className={label}>Material</label>
                <select value={f.material} onChange={set("material")} className={field}>
                  <option value="">Select…</option>
                  {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={label}>Dimensions (L × W × D)</label>
              <div className="flex items-center gap-2">
                <input value={f.length} onChange={set("length")} className={field} placeholder="L" inputMode="decimal" />
                <span className="text-ink-soft">×</span>
                <input value={f.width} onChange={set("width")} className={field} placeholder="W" inputMode="decimal" />
                <span className="text-ink-soft">×</span>
                <input value={f.depth} onChange={set("depth")} className={field} placeholder="D" inputMode="decimal" />
                <select value={f.unit} onChange={set("unit")} className={`${field} w-24`}>
                  <option value="in">in</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={label}>Finishes</label>
              <div className="flex flex-wrap gap-2">
                {FINISHES.map((x) => {
                  const on = finishes.includes(x);
                  return (
                    <button
                      type="button"
                      key={x}
                      onClick={() => toggleFinish(x)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${on ? "border-brand bg-brand-soft text-brand" : "border-line text-ink hover:border-brand"}`}
                    >
                      {x}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><label className={label}>Base color / PMS</label><input value={f.color} onChange={set("color")} className={field} placeholder="e.g. Kraft, PMS 3272 C" /></div>
              <div><label className={label}>Artwork link (optional)</label><input value={f.artwork} onChange={set("artwork")} className={field} placeholder="Google Drive / Dropbox link" /></div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="mb-4 font-bold text-ink">Your details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className={label}>Full name *</label><input required value={f.name} onChange={set("name")} className={field} /></div>
              <div><label className={label}>Email *</label><input required type="email" value={f.email} onChange={set("email")} className={field} /></div>
              <div><label className={label}>Phone</label><input value={f.phone} onChange={set("phone")} className={field} inputMode="tel" /></div>
              <div><label className={label}>Company</label><input value={f.company} onChange={set("company")} className={field} /></div>
              <div className="md:col-span-2">
                <label className={label}>Notes</label>
                <textarea value={f.notes} onChange={set("notes")} rows={3} className={`${field} h-auto py-2`} placeholder="Deadline, reference brands, special requirements…" />
              </div>
            </div>
          </div>

          {error && <p className="rounded-lg bg-brand-soft px-4 py-2 text-sm font-medium text-brand">{error}</p>}

          <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-base font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark disabled:opacity-60 md:w-auto md:px-10">
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? "Submitting…" : "Request my free quote"}
          </button>
        </form>

        {/* benefits */}
        <aside className="h-fit space-y-4 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-bold text-ink">What you get, free</h2>
          {[
            { Icon: Sparkles, t: "Free 3D mockup", s: "See your box before printing" },
            { Icon: PenTool, t: "Free design help", s: "We build your print-ready die-line" },
            { Icon: Truck, t: "Free shipping", s: "6–8 business-day turnaround" },
            { Icon: BadgeCheck, t: "No big minimums", s: "Order from just 50 units" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand"><Icon size={18} /></span>
              <div>
                <p className="text-sm font-bold text-ink">{t}</p>
                <p className="text-xs text-ink-soft">{s}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

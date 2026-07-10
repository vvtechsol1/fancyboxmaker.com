import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { COLORWAYS } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";

const FEATURES = [
  "Stronger brand identity",
  "Premium visual appeal",
  "Memorable first impression",
  "Protects your product & promotes your brand",
];

const CHIPS = ["Your logo", "Brand colours", "Premium finishes", "Any size"];

export default function BespokeCopy() {
  return (
    <section className="bg-white py-16">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ── text ── */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-green">Why FancyBoxMaker</span>
          <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-ink md:text-3xl">
            Bespoke boxes that elevate your brand &amp; increase sales
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
            Customers don&apos;t just buy products — they buy the{" "}
            <span className="font-semibold text-brand">experience</span> your packaging creates. A custom box
            protects your product in transit and promotes your brand on every doorstep, turning an ordinary
            delivery into a moment worth sharing — and driving repeat orders.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green text-white">
                  <Check size={13} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-brand)] transition hover:bg-brand-dark"
          >
            Read More
          </Link>
        </div>

        {/* ── designed visual ── */}
        <div className="relative">
          {/* decorative glow */}
          <div className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rounded-full bg-brand/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-6 h-44 w-44 rounded-full bg-green/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-brand-soft via-white to-cream p-6 shadow-[var(--shadow-lift)] sm:p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl border border-line bg-white p-3 shadow-sm" style={{ rotate: "-5deg" }}>
                <BoxMockup colorway={COLORWAYS.teal} label="Custom box" />
              </div>
              <div className="mt-6 aspect-square rounded-2xl border border-line bg-white p-3 shadow-sm" style={{ rotate: "5deg" }}>
                <BoxMockup colorway={COLORWAYS.navy} label="Custom box" />
              </div>
            </div>

            {/* related feature tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
                  <Check size={12} className="text-green" /> {c}
                </span>
              ))}
            </div>
          </div>

          {/* floating badges */}
          <div className="absolute -top-4 right-5 flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-lg">
            <Sparkles size={15} /> Free 3D Mockup
          </div>
          <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg">
            <span className="text-2xl font-extrabold text-brand">4.9★</span>
            <span className="text-xs leading-tight text-ink-soft">Trusted by<br />3,500+ brands</span>
          </div>
        </div>
      </div>
    </section>
  );
}

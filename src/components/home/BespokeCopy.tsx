import Link from "next/link";
import { Check } from "lucide-react";
import { COLORWAYS } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";

const FEATURES = [
  "Stronger brand identity",
  "Premium visual appeal",
  "Memorable first impression",
  "Protects your product & promotes your brand",
];

const TILES = [
  { box: COLORWAYS.teal, rot: "-6deg", cls: "col-span-1" },
  { box: COLORWAYS.navy, rot: "5deg", cls: "col-span-1" },
  { box: COLORWAYS.kraft, rot: "4deg", cls: "col-span-1" },
  { box: COLORWAYS.red, rot: "-5deg", cls: "col-span-1" },
];

export default function BespokeCopy() {
  return (
    <section className="bg-white py-16">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* text */}
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

        {/* visual */}
        <div className="relative">
          <div className="rounded-3xl border border-line bg-gradient-to-br from-brand-soft to-white p-6 shadow-[var(--shadow-lift)] sm:p-8">
            <div className="grid grid-cols-2 gap-4">
              {TILES.map((t, i) => (
                <div
                  key={i}
                  className={`aspect-square overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-sm ${t.cls}`}
                  style={{ rotate: t.rot }}
                >
                  <BoxMockup colorway={t.box} label={t.box.name} />
                </div>
              ))}
            </div>
          </div>
          {/* floating badge */}
          <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-lg">
            <span className="text-2xl font-extrabold text-brand">4.9★</span>
            <span className="text-xs leading-tight text-ink-soft">Trusted by<br />3,500+ brands</span>
          </div>
        </div>
      </div>
    </section>
  );
}

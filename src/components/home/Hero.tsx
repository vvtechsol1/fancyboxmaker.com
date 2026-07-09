import Link from "next/link";
import { COLORWAYS } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";

/** Overlapping/staggered montage of premium box tiles for the hero visual. */
const MONTAGE: { colorway: (typeof COLORWAYS)[keyof typeof COLORWAYS]; shift: string }[] = [
  { colorway: COLORWAYS.navy, shift: "sm:translate-y-6" },
  { colorway: COLORWAYS.kraft, shift: "" },
  { colorway: COLORWAYS.green, shift: "sm:translate-y-8" },
  { colorway: COLORWAYS.red, shift: "sm:-translate-y-2" },
  { colorway: COLORWAYS.gold, shift: "sm:translate-y-4" },
  { colorway: COLORWAYS.black, shift: "" },
  { colorway: COLORWAYS.teal, shift: "sm:translate-y-6" },
  { colorway: COLORWAYS.purple, shift: "" },
];

export default function Hero() {
  return (
    <section className="bg-cream-2 rounded-b-[48px]">
      <div className="container-x grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <span className="text-green font-bold uppercase tracking-widest text-sm">
            Premium
          </span>
          <h1 className="mt-4 font-display font-extrabold text-ink text-4xl leading-tight md:text-5xl">
            Custom Boxes Packaging &amp; Printing
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Make exclusively crafted custom packaging and printing. Our built-to-order
            boxes are designed to uplift your brand and safeguard your products.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="rounded-lg bg-brand px-6 py-3 font-bold uppercase tracking-wide text-white shadow-[var(--shadow-brand)] transition hover:bg-brand-dark active:scale-[.98]"
            >
              Get Free Quote!
            </Link>
            <Link
              href="/quote"
              className="rounded-lg bg-green px-6 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-green-dark active:scale-[.98]"
            >
              Book a Meeting
            </Link>
          </div>
        </div>

        {/* Visual montage — a "pile" of premium boxes */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            {MONTAGE.map((tile, i) => (
              <div
                key={i}
                className={`aspect-square overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-[var(--shadow-lift)] transition ${tile.shift}`}
              >
                <BoxMockup colorway={tile.colorway} label={tile.colorway.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

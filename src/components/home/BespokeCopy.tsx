import Link from "next/link";
import { Check, Sparkles, Package } from "lucide-react";
import { COLORWAYS } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";

const POINTS = [
  "Consistent, full-colour print quality",
  "Fast turnaround — rush orders & short runs",
  "Free custom design & realistic 3D mockups",
  "Eco-friendly & food-safe packaging options",
  "Low minimums — order from just 50 units",
];

const MARQUEE = [
  "Fast Express Delivery",
  "Custom Printed Packaging",
  "Free 3D Mockup",
  "Free Shipping Worldwide",
  "No Minimums",
];

// Colourful box cluster used until a real product photo is dropped at
// /public/images/bespoke.jpg (then swap this block for an <img>).
const CLUSTER = [
  { box: COLORWAYS.purple, cls: "col-start-2 row-start-1 w-40 xl:w-48", rot: "-6deg" },
  { box: COLORWAYS.pink, cls: "col-start-1 row-start-2 w-36 xl:w-44", rot: "5deg" },
  { box: COLORWAYS.teal, cls: "col-start-2 row-start-2 w-36 xl:w-44", rot: "-4deg" },
  { box: COLORWAYS.gold, cls: "col-start-1 row-start-1 w-28 xl:w-32 self-end", rot: "6deg" },
];

export default function BespokeCopy() {
  return (
    <section className="relative overflow-hidden">
      {/* rotating circular badge, overlapping the top */}
      <div className="absolute left-1/2 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-brand shadow-xl ring-4 ring-white" />
          <div className="absolute inset-0" style={{ animation: "spin 18s linear infinite" }}>
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="fbmBadge" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text fontSize="8.5" fontWeight="700" fill="#ffffff" letterSpacing="1.5">
                <textPath href="#fbmBadge">FREE 3D MOCKUP · FANCYBOXMAKER · </textPath>
              </text>
            </svg>
          </div>
          <div className="absolute inset-0 grid place-items-center text-white">
            <Package size={22} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* ── left: dark panel with minimal content ── */}
        <div
          className="relative px-6 py-16 text-white sm:px-10 lg:py-24"
          style={{
            background:
              "radial-gradient(120% 100% at 0% 100%, rgba(24,188,170,0.28), transparent 55%), linear-gradient(135deg, #0f1c36 0%, #241147 60%, #0b0620 100%)",
          }}
        >
          <div className="mx-auto max-w-xl lg:ml-auto lg:mr-0 lg:pr-12">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
              Your brand · our packaging
            </span>
            <h2 className="mt-5 font-serif text-3xl leading-tight md:text-4xl xl:text-5xl">
              Start your brand from here — here&apos;s what you get:
            </h2>

            <ul className="mt-8 space-y-4">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/85">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pink-500/20 text-pink-400">
                    <Check size={14} />
                  </span>
                  <span className="text-sm md:text-base">{p}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/quote"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#0b0620] shadow-lg transition hover:bg-white/90"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>

        {/* ── right: visual (swap for /images/bespoke.jpg when ready) ── */}
        <div className="relative min-h-[380px] overflow-hidden bg-gradient-to-br from-[#eef1f4] to-[#d7dce2] lg:min-h-full">
          {/* soft glow accents */}
          <div className="pointer-events-none absolute -left-10 top-10 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-40 w-40 rounded-full bg-pink-400/20 blur-3xl" />
          <div className="absolute inset-0 grid place-items-center p-8">
            <div className="bespoke-stage grid grid-cols-2 items-center gap-4">
              {CLUSTER.map((t, i) => (
                <div
                  key={i}
                  className={`bespoke-box overflow-hidden rounded-3xl bg-white/70 p-3 shadow-2xl ring-1 ring-black/5 backdrop-blur ${t.cls}`}
                  style={{ rotate: t.rot, animationDelay: `${i * 0.7}s` }}
                >
                  <BoxMockup colorway={t.box} label={t.box.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── bottom marquee strip ── */}
      <div className="overflow-hidden bg-brand py-3.5 text-white">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap text-sm font-bold uppercase tracking-wide">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((it, i) => (
            <span key={i} className="flex items-center gap-6">
              <Sparkles size={14} className="text-white/70" /> {it}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

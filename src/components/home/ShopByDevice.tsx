import Link from "next/link";
import { Package } from "lucide-react";
import { getBoxTypeBySlug } from "@/data/taxonomy";
import { countProductsByBoxType } from "@/lib/store";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const ACCENTS = [
  "from-[#0b5d5c] to-[#14a8a5]",
  "from-[#12233b] to-[#2b4a75]",
  "from-[#b07a48] to-[#d8a874]",
  "from-[#5b21b6] to-[#a78bfa]",
  "from-[#9f1239] to-[#ef4444]",
  "from-[#14532d] to-[#22a35a]",
  "from-[#8a6a1f] to-[#e9c66a]",
  "from-[#0e7490] to-[#22d3ee]",
];

// Curated popular box types shown on the homepage grid.
const POPULAR = [
  "mailer-boxes",
  "rigid-boxes",
  "kraft-boxes",
  "cosmetic-boxes",
  "pizza-boxes",
  "gift-boxes",
  "candle-boxes",
  "soap-boxes",
  "chocolate-boxes",
  "folding-cartons",
  "cbd-boxes",
  "bakery-boxes",
];

export default async function ShopByDevice() {
  const tiles = POPULAR.map((slug) => getBoxTypeBySlug(slug)).filter(Boolean) as { name: string; slug: string }[];
  const counts = await Promise.all(tiles.map((t) => countProductsByBoxType(t.slug)));
  return (
    <section id="shop-by-category" className="container-x scroll-mt-24 py-6 md:py-8">
      <SectionHeader title="Shop by Category" subtitle="Popular custom boxes — printed to your size, brand and finish." />
      <div className="flex snap-x gap-3 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 lg:grid-cols-6">
        {tiles.map((t, i) => {
          const count = counts[i];
          return (
            <Reveal key={t.slug} delay={(i % 6) * 0.04} className="w-[8.5rem] shrink-0 snap-start md:w-auto">
              <Link
                href={`/category/${t.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-[var(--shadow-soft)]"
              >
                <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} text-white shadow-sm transition-transform group-hover:scale-110`}>
                  <Package size={24} />
                </span>
                <span className="text-sm font-semibold text-ink">{t.name}</span>
                <span className="text-xs text-ink-soft">{count > 0 ? `${count} designs` : "Get a quote"}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

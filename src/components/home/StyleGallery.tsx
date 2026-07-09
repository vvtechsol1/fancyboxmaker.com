import Link from "next/link";
import { COLORWAYS } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const PICKS = [
  COLORWAYS.kraft,
  COLORWAYS.teal,
  COLORWAYS.black,
  COLORWAYS.navy,
  COLORWAYS.green,
  COLORWAYS.red,
  COLORWAYS.gold,
  COLORWAYS.purple,
];

export default function StyleGallery() {
  return (
    <section className="container-x py-6 md:py-8">
      <SectionHeader
        title="Finishes & colors for your boxes"
        subtitle="From natural kraft to metallic gold — printed edge-to-edge in full-color CMYK to match your brand."
        viewAllHref="/shop"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {PICKS.map((c, i) => (
          <Reveal key={c.name} delay={(i % 8) * 0.03}>
            <Link
              href="/shop"
              className="group relative block overflow-hidden rounded-2xl border border-line bg-surface"
              title={c.name}
            >
              <div className="aspect-square transition-transform duration-500 group-hover:scale-105">
                <BoxMockup colorway={c} label={c.name} />
              </div>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 py-2 text-center text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                {c.name}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

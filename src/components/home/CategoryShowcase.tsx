import Link from "next/link";
import { COLORWAYS, type Colorway } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";

/**
 * Infinite auto-sliding category cards (CSS marquee).
 *
 * Each card renders a branded BoxMockup on a soft surface tile, so there are
 * no external images to break — the row still scrolls continuously and loops
 * seamlessly (cards are rendered twice) and pauses on hover.
 */
type CardItem = {
  title: string;
  href: string;
  colorway: Colorway;
};

const CARDS: CardItem[] = [
  { title: "Mailer Boxes", href: "/category/mailer-boxes", colorway: COLORWAYS.navy },
  { title: "Rigid Boxes", href: "/category/rigid-boxes", colorway: COLORWAYS.teal },
  { title: "Kraft Boxes", href: "/category/kraft-boxes", colorway: COLORWAYS.kraft },
  { title: "Food Packaging", href: "/collection/food-packaging", colorway: COLORWAYS.red },
  { title: "Cosmetic Boxes", href: "/category/cosmetic-boxes", colorway: COLORWAYS.pink },
  { title: "Gift Boxes", href: "/category/gift-boxes", colorway: COLORWAYS.gold },
];

function Card({ c }: { c: CardItem }) {
  return (
    <Link
      href={c.href}
      className="group/card relative mr-4 block aspect-[3/5] w-[220px] shrink-0 overflow-hidden rounded-2xl border border-line bg-surface sm:w-[250px] lg:w-[280px]"
      aria-label={c.title}
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover/card:scale-105">
        <BoxMockup colorway={c.colorway} label={c.title} className="p-8" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 pt-12 text-center">
        <h3 className="text-base font-bold text-white drop-shadow-sm">{c.title}</h3>
        <span className="mt-1.5 inline-block border-b border-white/70 pb-0.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors group-hover/card:border-brand-glow group-hover/card:text-brand-glow">
          Shop Now
        </span>
      </div>
    </Link>
  );
}

export default function CategoryShowcase() {
  // rendered twice for a seamless infinite loop
  const loop = [...CARDS, ...CARDS];
  return (
    <section className="overflow-hidden py-6 md:py-8">
      <div className="[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div className="flex w-max animate-card-slide">
          {loop.map((c, i) => (
            <Card key={`${c.title}-${i}`} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { getBoxTypeBySlug } from "@/data/taxonomy";
import { COLORWAYS } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";

const FEATURED: { slug: string; name: string; colorway: (typeof COLORWAYS)[keyof typeof COLORWAYS] }[] = [
  { slug: "pizza-boxes", name: "Pizza Boxes", colorway: COLORWAYS.red },
  { slug: "chocolate-boxes", name: "Chocolate Boxes", colorway: COLORWAYS.kraft },
  { slug: "child-resistant-boxes", name: "Child Resistant Boxes", colorway: COLORWAYS.navy },
  { slug: "cereal-boxes", name: "Cereal Boxes", colorway: COLORWAYS.gold },
  { slug: "cbd-boxes", name: "CBD Boxes", colorway: COLORWAYS.green },
  { slug: "candle-boxes", name: "Candle Boxes", colorway: COLORWAYS.purple },
  { slug: "beverage-boxes", name: "Beverage Boxes", colorway: COLORWAYS.teal },
  { slug: "bakery-boxes", name: "Bakery Boxes", colorway: COLORWAYS.pink },
];

export default function CategoryGrid() {
  return (
    <section className="bg-cream py-10">
      <div className="container-x">
        <div className="gsap-stagger grid grid-cols-2 gap-6 md:grid-cols-4">
          {FEATURED.map((item) => {
            const boxType = getBoxTypeBySlug(item.slug);
            const name = boxType?.name ?? item.name;
            return (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className="group flex flex-col items-center transition"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-surface p-4 shadow-[var(--shadow-soft)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
                  <BoxMockup colorway={item.colorway} label={name} />
                </div>
                <span className="mt-4 text-center font-bold text-ink">{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/data/products";
import BoxMockup from "@/components/product/BoxMockup";

/**
 * "See Our Latest Collection" — a compact grid of up to 8 products.
 * Server component: no interactivity, just links to product pages.
 */
export default function LatestCollection({ products }: { products: Product[] }) {
  const items = products.slice(0, 8);
  if (!items.length) return null;

  return (
    <section className="bg-white">
      <div className="container-x py-14">
        <h2 className="text-center font-display text-3xl font-extrabold text-ink md:text-4xl">
          See Our Latest Collection
        </h2>

        <div className="gsap-stagger mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {items.map((p) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="group flex flex-col rounded-2xl bg-surface p-4 text-center shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
                {p.images && p.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <BoxMockup colorway={p.colorway} label={p.boxTypeName} />
                )}
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-green">
                <span className="text-green/50">••••••</span> In Stock{" "}
                <span className="text-green/50">••••••</span>
              </p>

              <h3 className="mt-1 line-clamp-2 font-bold text-ink">{p.name}</h3>

              <span className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-brand-dark">
                <Package size={16} />
                BUY NOW
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function ProductRail({
  title,
  subtitle,
  viewAllHref,
  products,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  products: Product[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section className="container-x py-6 md:py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="heading-accent text-2xl font-extrabold tracking-tight text-ink font-display md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-3 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link href={viewAllHref} className="hidden text-sm font-semibold text-brand hover:underline sm:block">
              View all →
            </Link>
          )}
          <button onClick={() => scrollBy(-1)} aria-label="Scroll left"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Scroll right"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={ref} className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2">
        {products.map((p) => (
          <div key={p.slug} className="w-[44vw] shrink-0 snap-start sm:w-[240px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

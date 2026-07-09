import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBoxTypeBySlug, getCategoryOfType } from "@/data/taxonomy";
import { getProductsByBoxType } from "@/lib/store";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const boxType = getBoxTypeBySlug(slug);
  if (!boxType) return { title: "Not found" };
  return {
    title: `Custom ${boxType.name} — Printed & Wholesale`,
    description: `Design custom printed ${boxType.name.toLowerCase()} at FancyBoxMaker. Any size, full-color printing, premium finishes, free 3D mockup, free design and free shipping.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function BoxTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boxType = getBoxTypeBySlug(slug);
  const category = getCategoryOfType(slug);
  if (!boxType || !category) notFound();

  const items = await getProductsByBoxType(slug);
  const siblings = category.types.filter((t) => t.slug !== slug).slice(0, 14);

  return (
    <div className="container-x py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/collection/${category.slug}`} className="hover:text-brand">{category.name}</Link>
        <ChevronRight size={14} />
        <span className="text-ink">{boxType.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink font-display md:text-4xl">
          Custom <span className="text-brand">{boxType.name}</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Custom-printed {boxType.name.toLowerCase()} built to your exact size and brand. Full-color printing, premium finishes,
          free 3D mockup and free design assistance — shipped free in 6–8 business days.
        </p>
      </header>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center">
          <h2 className="text-lg font-bold text-ink">Let&apos;s build your {boxType.name.toLowerCase()}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
            Tell us your dimensions, material and finish and we&apos;ll send a free quote and a 3D mockup — usually within a few hours.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Get a Free Quote
          </Link>
        </div>
      )}

      {/* other box types in this category */}
      {siblings.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-bold text-ink font-display">More {category.name}</h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((t) => (
              <Link
                key={t.slug}
                href={`/category/${t.slug}`}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

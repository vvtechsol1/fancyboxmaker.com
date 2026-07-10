import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlugLive } from "@/lib/taxonomy-store";
import { getProductsByCategory } from "@/lib/store";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryBySlugLive(slug);
  if (!c) return { title: "Not found" };
  return {
    title: `${c.name} — Custom Printed Packaging`,
    description: `Explore ${c.name.toLowerCase()} at FancyBoxMaker — custom sizes, full-color printing and premium finishes with free design, free 3D mockup and free shipping.`,
    alternates: { canonical: `/collection/${slug}` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlugLive(slug);
  if (!category) notFound();

  const items = await getProductsByCategory(slug);

  return (
    <div className="container-x py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight size={14} />
        <span className="text-ink">{category.name}</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-line bg-gradient-to-br from-ink to-[#2b4a75] p-8 text-white">
        <h1 className="text-3xl font-extrabold tracking-tight font-display md:text-4xl">{category.name}</h1>
        {category.blurb && <p className="mt-2 max-w-2xl text-sm text-white/70">{category.blurb}</p>}
      </header>

      {/* box-type picker */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-soft">Choose a box type</h2>
        <div className="flex flex-wrap gap-2">
          {category.types.map((t) => (
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

      {items.length > 0 ? (
        <>
          <h2 className="mb-4 text-xl font-bold text-ink font-display">Popular {category.name.toLowerCase()}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-ink-soft">
          Pick a box type above to see custom {category.name.toLowerCase()} ready to print.
        </p>
      )}
    </div>
  );
}

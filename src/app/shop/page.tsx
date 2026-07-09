import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/store";
import { categories } from "@/data/taxonomy";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Custom Boxes",
  description:
    "Browse every custom printed box at FancyBoxMaker — mailer, rigid, kraft, food & retail packaging. Free design, free 3D mockup and free shipping.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = (q || "").trim().toLowerCase();

  let items = await getAllProducts();
  if (category) items = items.filter((p) => p.category === category);
  if (query)
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.boxTypeName.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
    );

  return (
    <div className="container-x py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink font-display md:text-4xl">
          {query ? `Results for “${q}”` : "All Custom Boxes"}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {items.length} product{items.length === 1 ? "" : "s"} available
        </p>
      </header>

      {/* category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${!category ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-ink hover:border-brand"}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${category === c.slug ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-ink hover:border-brand"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {items.length > 0 ? (
        <div className="gsap-stagger grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <p className="text-ink">No products matched your search.</p>
          <Link href="/shop" className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
            Browse all boxes
          </Link>
        </div>
      )}
    </div>
  );
}

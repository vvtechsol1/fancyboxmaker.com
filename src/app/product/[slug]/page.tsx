import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelated } from "@/lib/store";
import { getProductReviews } from "@/data/productReviews";
import { SITE } from "@/lib/site";
import ProductView from "@/components/product/ProductView";
import ProductReviews from "@/components/product/ProductReviews";
import ProductRail from "@/components/home/ProductRail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.shortDescription,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      title: p.name,
      description: p.shortDescription,
      images: p.images?.length ? [{ url: p.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const related = await getRelated(p, 10);
  const rv = getProductReviews(p.slug, p.boxTypeName);
  const url = `${SITE.url}/product/${p.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription,
    image: p.images?.length ? p.images.map((i) => `${SITE.url}${i}`) : [`${SITE.url}/icon.png`],
    brand: { "@type": "Brand", name: SITE.name },
    category: p.boxTypeName,
    aggregateRating: { "@type": "AggregateRating", ratingValue: rv.average, reviewCount: rv.count },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: p.price,
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    },
  };

  return (
    <div className="container-x py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/collection/${p.category}`} className="hover:text-brand">{p.categoryName}</Link>
        <ChevronRight size={14} />
        <Link href={`/category/${p.boxType}`} className="hover:text-brand">{p.boxTypeName}</Link>
        <ChevronRight size={14} />
        <span className="truncate text-ink">{p.name}</span>
      </nav>

      <ProductView product={p} reviewCount={rv.count} reviewAverage={rv.average} />

      <section className="mt-12 max-w-3xl">
        <h2 className="mb-4 text-xl font-bold text-ink font-display">Product Description</h2>
        <div className="prose-product" dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} />
      </section>

      {p.specifications?.length ? (
        <section className="mt-10 max-w-3xl">
          <h2 className="mb-4 text-xl font-bold text-ink font-display">Specifications</h2>
          <div className="overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {p.specifications.map((s) => (
                  <tr key={s.label}>
                    <td className="w-1/3 bg-surface px-4 py-3 font-semibold text-ink">{s.label}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <ProductReviews reviews={rv.reviews} count={rv.count} average={rv.average} distribution={rv.distribution} />

      <ProductRail title="You may also like" products={related} />
    </div>
  );
}

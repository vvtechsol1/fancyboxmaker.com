import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllProducts } from "@/lib/store";
import { getCategories } from "@/lib/taxonomy-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);
  const base = SITE.url;
  const staticRoutes = ["", "/shop", "/about", "/contact", "/faqs", "/track-order"].map((r) => ({
    url: `${base}${r || "/"}`,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.6,
  }));

  const collectionRoutes = categories.map((c) => ({
    url: `${base}/collection/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const boxTypeRoutes = categories.flatMap((c) =>
    c.types.map((tp) => ({
      url: `${base}/category/${tp.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...boxTypeRoutes, ...productRoutes];
}

import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/store";

/** Public, lightweight search index consumed by the header SearchBar (client). */
export async function GET() {
  const products = await getAllProducts();
  const items = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    categoryName: p.categoryName,
    boxTypeName: p.boxTypeName,
  }));
  return NextResponse.json({ products: items });
}

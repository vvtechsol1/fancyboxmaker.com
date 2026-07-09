import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/lib/store";
import type { Product } from "@/data/products";

async function guard() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const g = await guard();
  if (g) return g;
  return NextResponse.json({ ok: true, products: await getAllProducts() });
}

export async function POST(req: Request) {
  const g = await guard();
  if (g) return g;
  try {
    const product = (await req.json()) as Product;
    const saved = await addProduct(product);
    return NextResponse.json({ ok: true, product: saved });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const g = await guard();
  if (g) return g;
  try {
    const { slug, product } = (await req.json()) as { slug: string; product: Product };
    const saved = await updateProduct(slug, product);
    return NextResponse.json({ ok: true, product: saved });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (g) return g;
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  await deleteProduct(slug);
  return NextResponse.json({ ok: true });
}

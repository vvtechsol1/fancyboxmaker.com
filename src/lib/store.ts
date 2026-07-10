import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { seedProducts, type Product } from "@/data/products";

// The live catalogue lives in a JSON file so the Admin panel can edit it.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "products.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.access(FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(seedProducts, null, 2), "utf8");
  }
}

// In-memory cache so the 254KB catalogue is read+parsed ONCE per server process
// instead of on every getAllProducts() call (pages call it many times per request).
let _cache: Product[] | null = null;

export async function getAllProducts(): Promise<Product[]> {
  if (_cache) return _cache;
  try {
    await ensureFile();
    const raw = await fs.readFile(FILE, "utf8");
    const list = JSON.parse(raw) as Product[];
    _cache = Array.isArray(list) ? list : [];
  } catch {
    // No writable/readable filesystem (e.g. Cloudflare Workers) → use the
    // bundled seed catalogue so product browsing still works on the edge.
    _cache = seedProducts;
  }
  return _cache;
}

async function saveAll(list: Product[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
  _cache = list; // keep the cache in sync with admin edits
}

// ---------------- reads ----------------
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.slug === slug);
}
export async function getProductsByBoxType(boxTypeSlug: string): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.boxType === boxTypeSlug);
}
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.category === categorySlug);
}
export async function getFeatured(limit = 12): Promise<Product[]> {
  const all = await getAllProducts();
  const f = all.filter((p) => p.featured);
  return (f.length ? f : all).slice(0, limit);
}
export async function getHot(limit = 12): Promise<Product[]> {
  const all = await getAllProducts();
  const h = all.filter((p) => p.isHot);
  return (h.length ? h : all).slice(0, limit);
}
export async function getNewArrivals(limit = 12): Promise<Product[]> {
  const all = await getAllProducts();
  const n = all.filter((p) => p.isNew);
  return (n.length ? n : all).slice(0, limit);
}
export async function getRelated(p: Product, limit = 10): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .filter((x) => x.slug !== p.slug && (x.boxType === p.boxType || x.type === p.type))
    .slice(0, limit);
}
export async function countProductsByCategory(categorySlug: string): Promise<number> {
  return (await getProductsByCategory(categorySlug)).length;
}
export async function countProductsByBoxType(boxTypeSlug: string): Promise<number> {
  return (await getProductsByBoxType(boxTypeSlug)).length;
}

// ---------------- writes (Admin) ----------------
export async function addProduct(p: Product): Promise<Product> {
  const all = await getAllProducts();
  if (all.some((x) => x.slug === p.slug)) {
    throw new Error(`A product with slug "${p.slug}" already exists.`);
  }
  all.unshift(p);
  await saveAll(all);
  return p;
}

export async function updateProduct(slug: string, patch: Product): Promise<Product> {
  const all = await getAllProducts();
  const i = all.findIndex((x) => x.slug === slug);
  if (i === -1) throw new Error(`Product "${slug}" not found.`);
  all[i] = { ...patch };
  await saveAll(all);
  return all[i];
}

export async function deleteProduct(slug: string): Promise<void> {
  const all = await getAllProducts();
  await saveAll(all.filter((x) => x.slug !== slug));
}

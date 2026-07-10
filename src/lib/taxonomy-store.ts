import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { D1Database } from "@cloudflare/workers-types";
import { categories as BASE, type BoxCategory, type BoxType } from "@/data/taxonomy";

/**
 * Admin-editable taxonomy (category groups + their box types).
 * Dual-mode: data/taxonomy.json locally, D1 table `taxonomy` on Cloudflare.
 * Defaults to the bundled static taxonomy so the site works out of the box.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "taxonomy.json");

let _cache: BoxCategory[] | null = null;
let _cacheAt = 0;
const CACHE_TTL_MS = 5000;

async function getD1(): Promise<D1Database | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = mod.getCloudflareContext?.();
    return (ctx?.env as { DB?: D1Database } | undefined)?.DB ?? null;
  } catch {
    return null;
  }
}

function valid(list: unknown): list is BoxCategory[] {
  return Array.isArray(list) && list.every((c) => c && typeof c === "object" && Array.isArray((c as BoxCategory).types));
}

export async function getCategories(): Promise<BoxCategory[]> {
  if (_cache && Date.now() - _cacheAt < CACHE_TTL_MS) return _cache;
  let next: BoxCategory[] = BASE;
  const db = await getD1();
  if (db) {
    try {
      const row = await db.prepare("SELECT data FROM taxonomy WHERE key = ?").bind("categories").first<{ data: string }>();
      if (row) {
        const parsed = JSON.parse(row.data);
        if (valid(parsed)) next = parsed;
      }
    } catch {
      next = BASE;
    }
  } else {
    try {
      const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
      if (valid(parsed)) next = parsed;
    } catch {
      next = BASE;
    }
  }
  _cache = next;
  _cacheAt = Date.now();
  return next;
}

export async function saveCategories(cats: BoxCategory[]): Promise<BoxCategory[]> {
  if (!valid(cats)) throw new Error("Invalid taxonomy");
  const db = await getD1();
  const json = JSON.stringify(cats);
  if (db) {
    await db
      .prepare("INSERT INTO taxonomy (key, data) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data")
      .bind("categories", json)
      .run();
  } else {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, json, "utf8");
  }
  _cache = cats;
  _cacheAt = Date.now();
  return cats;
}

/* ── async helpers over the live taxonomy ─────────────────── */

export async function getCategoryBySlugLive(slug: string): Promise<BoxCategory | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}
export async function getCategoryOfTypeLive(typeSlug: string): Promise<BoxCategory | undefined> {
  return (await getCategories()).find((c) => c.types.some((t) => t.slug === typeSlug));
}
export async function getBoxTypeBySlugLive(slug: string): Promise<BoxType | undefined> {
  for (const c of await getCategories()) {
    const found = c.types.find((t) => t.slug === slug);
    if (found) return found;
  }
  return undefined;
}
export async function allBoxTypesLive(): Promise<{ category: BoxCategory; type: BoxType }[]> {
  return (await getCategories()).flatMap((c) => c.types.map((type) => ({ category: c, type })));
}

/** Turn a display name into a url-safe slug, e.g. "Wine Boxes" → "wine-boxes". */
export function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

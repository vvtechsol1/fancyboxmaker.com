import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { D1Database } from "@cloudflare/workers-types";

// Storage for form submissions (orders, quotes).
// - Locally (npm run dev / start): JSON files under /data — so the demo works.
// - On Cloudflare (Workers + D1): the `DB` binding — so live data persists.
// The two collections map 1:1 to the D1 tables created in migrations/0001_init.sql.

const DATA_DIR = path.join(process.cwd(), "data");
const D1_TABLES = new Set(["orders", "quotes"]);

function fileFor(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

/** Returns the Cloudflare D1 binding when running on Cloudflare, else null (local). */
async function getD1(collection: string): Promise<D1Database | null> {
  if (!D1_TABLES.has(collection)) return null;
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = mod.getCloudflareContext?.();
    return (ctx?.env as { DB?: D1Database } | undefined)?.DB ?? null;
  } catch {
    return null; // not on Cloudflare (local dev / node) → fall back to files
  }
}

export async function readSubmissions<T = unknown>(collection: string): Promise<T[]> {
  const db = await getD1(collection);
  if (db) {
    const res = await db.prepare(`SELECT data FROM ${collection} ORDER BY created_at DESC`).all<{ data: string }>();
    return (res.results ?? []).map((r) => JSON.parse(r.data) as T);
  }
  try {
    const raw = await fs.readFile(fileFor(collection), "utf8");
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function appendSubmission<T extends object>(collection: string, record: T): Promise<void> {
  const db = await getD1(collection);
  if (db) {
    const r = record as Record<string, unknown>;
    const cust = (r.customer ?? {}) as Record<string, unknown>;
    const ref = String(r.ref ?? makeRef(collection.slice(0, 3).toUpperCase()));
    const createdAt = String(r.createdAt ?? new Date().toISOString());
    const name = String(r.name ?? cust.name ?? "");
    const email = String(r.email ?? cust.email ?? "");
    const phone = String(r.phone ?? cust.phone ?? "");
    await db
      .prepare(`INSERT INTO ${collection} (ref, created_at, name, email, phone, data) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(ref, createdAt, name, email, phone, JSON.stringify(record))
      .run();
    return;
  }
  const list = await readSubmissions<T>(collection);
  list.unshift(record);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(collection), JSON.stringify(list, null, 2), "utf8");
}

/** Short human-friendly reference, e.g. FBM-L5K3P9. */
export function makeRef(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

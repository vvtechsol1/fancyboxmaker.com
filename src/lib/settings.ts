import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { D1Database } from "@cloudflare/workers-types";
import { SITE, announcements } from "@/lib/site";

/**
 * Site-wide, admin-editable settings (a lightweight CMS).
 * Stored as a single JSON blob:
 *  - locally: data/settings.json
 *  - on Cloudflare: D1 table `settings` (key='site', data=JSON)
 * Applied at runtime by the root layout (colors, favicon, metadata) and the
 * Header / Footer / Hero components (branding, copy, contact, socials).
 */
export type SiteSettings = {
  // ── Branding ────────────────────────────────────────────
  brandName: string;
  logoText1: string; // first part of the wordmark
  logoText2: string; // accent part of the wordmark
  logoImage: string; // optional data-URI / URL — overrides the text wordmark
  favicon: string; // optional data-URI / URL for the browser-tab icon

  // ── Theme colors ────────────────────────────────────────
  colorPrimary: string;
  colorPrimaryDark: string;
  colorSecondary: string;
  colorBg: string; // page background (cream)
  colorInk: string; // headings / body text

  // ── Top bar + header ────────────────────────────────────
  topbarEnabled: boolean;
  announcements: string[];
  phone: string;
  email: string;
  navLinks: { label: string; href: string }[];

  // ── Hero banner ─────────────────────────────────────────
  heroEyebrow: string;
  heroHeadingPrefix: string;
  heroWords: string[]; // rotating typewriter words
  heroSubtitle: string;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryHref: string;
  heroCtaSecondaryLabel: string;
  heroCtaSecondaryHref: string;

  // ── Footer ──────────────────────────────────────────────
  footerDescription: string;
  footerCopyright: string; // {year} is replaced with the current year
  address: string;
  instagram: string;
  facebook: string;
  twitter: string;

  // ── SEO ─────────────────────────────────────────────────
  seoTitle: string;
  seoDescription: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: SITE.name,
  logoText1: "FancyBox",
  logoText2: "Maker",
  logoImage: "",
  favicon: "",

  colorPrimary: "#18bcaa",
  colorPrimaryDark: "#0e9c8c",
  colorSecondary: "#4a9e3f",
  colorBg: "#f7f1e8",
  colorInk: "#1a1a1a",

  topbarEnabled: true,
  announcements: [...announcements],
  phone: SITE.phoneDisplay,
  email: SITE.email,
  navLinks: [
    { label: "Shop All", href: "/shop" },
    { label: "Get a Quote", href: "/quote" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  heroEyebrow: "#1 Printing Services NYC",
  heroHeadingPrefix: "Find your best solution",
  heroWords: ["Retail Packaging", "Luxury Packaging"],
  heroSubtitle: "Packaging is the first impression your brand makes on a customer.",
  heroCtaPrimaryLabel: "Get Free Quote",
  heroCtaPrimaryHref: "/quote",
  heroCtaSecondaryLabel: "Explore Boxes",
  heroCtaSecondaryHref: "/shop",

  footerDescription:
    "FancyBoxMaker is a trusted provider of premium custom printed packaging — crafting and shipping bespoke boxes in bulk for brands across the USA and worldwide.",
  footerCopyright: "© {year} — All Rights Reserved by FancyBoxMaker.com",
  address: "Billings, Montana, USA",
  instagram: SITE.instagram,
  facebook: SITE.facebook,
  twitter: SITE.tiktok,

  seoTitle: `${SITE.name} — ${SITE.tagline}`,
  seoDescription: SITE.description,
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "settings.json");

let _cache: SiteSettings | null = null;
let _cacheAt = 0;
const CACHE_TTL_MS = 5000; // bound cross-isolate staleness after an admin save

async function getD1(): Promise<D1Database | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = mod.getCloudflareContext?.();
    return (ctx?.env as { DB?: D1Database } | undefined)?.DB ?? null;
  } catch {
    return null;
  }
}

/** Merge stored (partial) settings over the defaults so new fields always exist. */
function merge(stored: Partial<SiteSettings> | null | undefined): SiteSettings {
  return { ...DEFAULT_SETTINGS, ...(stored || {}) };
}

export async function getSettings(): Promise<SiteSettings> {
  if (_cache && Date.now() - _cacheAt < CACHE_TTL_MS) return _cache;
  let next: SiteSettings;
  const db = await getD1();
  if (db) {
    try {
      const row = await db.prepare("SELECT data FROM settings WHERE key = ?").bind("site").first<{ data: string }>();
      next = merge(row ? (JSON.parse(row.data) as Partial<SiteSettings>) : null);
    } catch {
      next = { ...DEFAULT_SETTINGS };
    }
  } else {
    try {
      const raw = await fs.readFile(FILE, "utf8");
      next = merge(JSON.parse(raw) as Partial<SiteSettings>);
    } catch {
      next = { ...DEFAULT_SETTINGS };
    }
  }
  _cache = next;
  _cacheAt = Date.now();
  return next;
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const next = merge({ ...current, ...patch });
  const db = await getD1();
  if (db) {
    await db
      .prepare("INSERT INTO settings (key, data) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data")
      .bind("site", JSON.stringify(next))
      .run();
  } else {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
  }
  _cache = next;
  _cacheAt = Date.now();
  return next;
}

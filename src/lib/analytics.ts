import "server-only";
import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data");
const FILE = path.join(DIR, "events.json");
const MAX_EVENTS = 8000; // keep the file bounded

export type TrackType = "view" | "search" | "order";
export type Ev = { type: TrackType; label: string; product?: string; device?: "mobile" | "desktop"; ts: number };

async function read(): Promise<Ev[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function addEvent(e: { type: TrackType; label: string; product?: string; device?: string }): Promise<void> {
  const list = await read();
  const device = e.device === "mobile" ? "mobile" : e.device === "desktop" ? "desktop" : undefined;
  list.push({ type: e.type, label: e.label.slice(0, 200), product: e.product?.slice(0, 200), device, ts: Date.now() });
  const trimmed = list.slice(-MAX_EVENTS);
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(trimmed), "utf8");
}

function topBy(list: Ev[], type: TrackType, limit = 10) {
  const counts = new Map<string, number>();
  for (const e of list) {
    if (e.type !== type) continue;
    const key = e.label || "(unknown)";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getStats() {
  const list = await read();
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const views = list.filter((e) => e.type === "view");
  const mobileViews = views.filter((e) => e.device === "mobile").length;
  const desktopViews = views.filter((e) => e.device === "desktop").length;
  return {
    totals: {
      visits: views.length,
      visitsToday: views.filter((e) => e.ts >= dayAgo).length,
      visitsWeek: views.filter((e) => e.ts >= weekAgo).length,
      searches: list.filter((e) => e.type === "search").length,
      orderClicks: list.filter((e) => e.type === "order").length,
      events: list.length,
    },
    deviceViews: { mobile: mobileViews, desktop: desktopViews },
    topPages: topBy(list, "view"),
    topSearches: topBy(list, "search"),
    topOrders: topBy(list, "order"),
  };
}

export async function resetStats(): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(FILE, "[]", "utf8");
}

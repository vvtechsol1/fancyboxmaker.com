import "server-only";
import { promises as fs } from "fs";
import path from "path";

// Real-time presence: which sessions are active RIGHT NOW, by device.
// Stored in a small JSON file so the count is correct regardless of how many
// worker processes the server uses (in-memory state can split across workers).
// A session only counts while it keeps sending heartbeats — nothing faked.

type Session = { device: "mobile" | "desktop"; ts: number };
type Store = Record<string, Session>;

const DIR = path.join(process.cwd(), "data");
const FILE = path.join(DIR, "presence.json");
const WINDOW_MS = 30_000; // "live" = seen within the last 30s

async function read(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

async function write(obj: Store): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(obj), "utf8");
}

function prune(obj: Store): Store {
  const cutoff = Date.now() - WINDOW_MS;
  const keep: Store = {};
  for (const [sid, s] of Object.entries(obj)) if (s.ts >= cutoff) keep[sid] = s;
  return keep;
}

export async function heartbeat(sid: string, device: string): Promise<void> {
  const obj = prune(await read());
  obj[sid] = { device: device === "mobile" ? "mobile" : "desktop", ts: Date.now() };
  await write(obj);
}

export async function getLive(): Promise<{ mobile: number; desktop: number; total: number }> {
  const obj = prune(await read());
  await write(obj);
  let mobile = 0;
  let desktop = 0;
  for (const s of Object.values(obj)) {
    if (s.device === "mobile") mobile++;
    else desktop++;
  }
  return { mobile, desktop, total: mobile + desktop };
}

import "server-only";
import { promises as fs } from "fs";
import path from "path";

// Simple JSON-file storage for form submissions (orders, quotes).
// Mirrors the products store pattern so the Admin panel can read them.
const DATA_DIR = path.join(process.cwd(), "data");

function fileFor(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

export async function readSubmissions<T = unknown>(collection: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(fileFor(collection), "utf8");
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function appendSubmission<T extends object>(collection: string, record: T): Promise<void> {
  const list = await readSubmissions<T>(collection);
  list.unshift(record);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(collection), JSON.stringify(list, null, 2), "utf8");
}

/** Short human-friendly reference, e.g. FBM-L5K3P9. */
export function makeRef(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

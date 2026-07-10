// Cloudflare bindings (see wrangler.jsonc). Types are imported scoped (NOT via a
// global /// <reference/>) so they don't override the DOM Request/Response types.
import type { D1Database, Fetcher } from "@cloudflare/workers-types";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    ASSETS: Fetcher;
  }
}

export {};

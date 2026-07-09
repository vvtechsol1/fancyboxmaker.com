import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cb_admin";

/** Admin password — change ADMIN_PASSWORD in .env.local for production. */
export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "casebazar123";
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === adminPassword();
}

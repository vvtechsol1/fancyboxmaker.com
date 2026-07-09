import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getStats, resetStats } from "@/lib/analytics";
import { getLive } from "@/lib/presence";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const stats = await getStats();
  return NextResponse.json({ ok: true, stats: { ...stats, live: await getLive() } });
}

export async function DELETE() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  await resetStats();
  return NextResponse.json({ ok: true });
}

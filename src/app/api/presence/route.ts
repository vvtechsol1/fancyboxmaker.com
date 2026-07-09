import { NextResponse } from "next/server";
import { heartbeat } from "@/lib/presence";

export async function POST(req: Request) {
  try {
    const { sid, device } = await req.json();
    if (typeof sid === "string" && sid) await heartbeat(sid, device);
  } catch {
    /* ignore malformed beacons */
  }
  return NextResponse.json({ ok: true });
}

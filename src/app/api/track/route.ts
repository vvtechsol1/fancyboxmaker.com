import { NextResponse } from "next/server";
import { addEvent, type TrackType } from "@/lib/analytics";

const ALLOWED: TrackType[] = ["view", "search", "order"];

export async function POST(req: Request) {
  try {
    const { type, label, product, device } = await req.json();
    if (!ALLOWED.includes(type) || typeof label !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await addEvent({
      type,
      label,
      product: typeof product === "string" ? product : undefined,
      device: typeof device === "string" ? device : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

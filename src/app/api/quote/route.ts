import { NextResponse } from "next/server";
import { appendSubmission, makeRef } from "@/lib/submissions";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name || !b.email) {
      return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
    }
    if (!(await verifyTurnstile(b.turnstileToken, req.headers.get("CF-Connecting-IP")))) {
      return NextResponse.json({ ok: false, error: "Captcha verification failed. Please try again." }, { status: 400 });
    }
    const ref = makeRef("QTE");
    const quote = {
      ref,
      createdAt: new Date().toISOString(),
      status: "new",
      boxType: b.boxType ? String(b.boxType) : "",
      dimensions: {
        length: b.length ? String(b.length) : "",
        width: b.width ? String(b.width) : "",
        depth: b.depth ? String(b.depth) : "",
        unit: b.unit ? String(b.unit) : "in",
      },
      quantity: b.quantity ? String(b.quantity) : "",
      material: b.material ? String(b.material) : "",
      finishes: Array.isArray(b.finishes) ? b.finishes.map(String) : [],
      color: b.color ? String(b.color) : "",
      artwork: b.artwork ? String(b.artwork) : "",
      name: String(b.name),
      email: String(b.email),
      phone: b.phone ? String(b.phone) : "",
      company: b.company ? String(b.company) : "",
      notes: b.notes ? String(b.notes) : "",
    };
    await appendSubmission("quotes", quote);
    return NextResponse.json({ ok: true, ref });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not submit quote." }, { status: 500 });
  }
}

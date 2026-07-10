import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSettings, saveSettings, type SiteSettings } from "@/lib/settings";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, settings: await getSettings() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const patch = (await req.json()) as Partial<SiteSettings>;
    const saved = await saveSettings(patch);
    return NextResponse.json({ ok: true, settings: saved });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}

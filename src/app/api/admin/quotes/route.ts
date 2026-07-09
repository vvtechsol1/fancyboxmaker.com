import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readSubmissions } from "@/lib/submissions";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const quotes = await readSubmissions("quotes");
  return NextResponse.json({ ok: true, quotes });
}

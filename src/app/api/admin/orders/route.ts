import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readSubmissions } from "@/lib/submissions";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const orders = await readSubmissions("orders");
  return NextResponse.json({ ok: true, orders });
}

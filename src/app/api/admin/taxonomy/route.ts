import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getCategories, saveCategories } from "@/lib/taxonomy-store";
import type { BoxCategory } from "@/data/taxonomy";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, categories: await getCategories() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { categories } = (await req.json()) as { categories: BoxCategory[] };
    const saved = await saveCategories(categories);
    return NextResponse.json({ ok: true, categories: saved });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}

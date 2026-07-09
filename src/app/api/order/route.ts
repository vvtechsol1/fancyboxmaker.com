import { NextResponse } from "next/server";
import { appendSubmission, makeRef } from "@/lib/submissions";

type OrderItem = {
  slug: string;
  name: string;
  boxTypeName?: string;
  type?: string;
  price: number;
  colorName?: string;
  variantLabel?: string;
  qty: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = (body.items ?? []) as OrderItem[];
    const customer = body.customer ?? {};
    const shipping = body.shipping ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
    }
    if (!customer.name || !customer.email) {
      return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
    const ref = makeRef("FBM");
    const order = {
      ref,
      createdAt: new Date().toISOString(),
      status: "new",
      items,
      subtotal,
      customer: {
        name: String(customer.name),
        email: String(customer.email),
        phone: customer.phone ? String(customer.phone) : "",
        company: customer.company ? String(customer.company) : "",
      },
      shipping: {
        address: shipping.address ? String(shipping.address) : "",
        city: shipping.city ? String(shipping.city) : "",
        state: shipping.state ? String(shipping.state) : "",
        zip: shipping.zip ? String(shipping.zip) : "",
        country: shipping.country ? String(shipping.country) : "",
      },
      notes: body.notes ? String(body.notes) : "",
    };

    await appendSubmission("orders", order);
    return NextResponse.json({ ok: true, ref });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not place order." }, { status: 500 });
  }
}

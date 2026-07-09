"use client";

import Link from "next/link";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart, lineId } from "@/lib/cart";
import { formatPrice, SITE } from "@/lib/site";

export default function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();
  const freeShip = subtotal >= SITE.freeShippingThreshold;

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface text-ink-soft">
          <ShoppingCart size={34} />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-ink font-display">Your cart is empty</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Browse our custom boxes or request a free quote for a fully bespoke design.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Shop boxes</Link>
          <Link href="/quote" className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand">Get a free quote</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-ink font-display md:text-3xl">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* line items */}
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {items.map((i) => {
            const id = lineId(i);
            return (
              <div key={id} className="flex gap-4 p-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface">
                  {i.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-ink-soft">BOX</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${i.slug}`} className="font-semibold text-ink hover:text-brand">{i.name}</Link>
                  <p className="mt-0.5 text-xs text-ink-soft">{[i.type, i.variantLabel, i.colorName].filter(Boolean).join(" · ")}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full border border-line">
                      <button onClick={() => setQty(id, i.qty - 1)} aria-label="Decrease" className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface"><Minus size={15} /></button>
                      <span className="w-8 text-center text-sm font-bold">{i.qty}</span>
                      <button onClick={() => setQty(id, i.qty + 1)} aria-label="Increase" className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface"><Plus size={15} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-ink">{formatPrice(i.price * i.qty)}</span>
                      <button onClick={() => remove(id)} aria-label="Remove" className="text-ink-soft hover:text-brand"><Trash2 size={17} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-4 font-bold text-ink">Order summary</h2>
          <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-ink-soft">Shipping</span>
            <span className="font-semibold text-ink">{freeShip ? "Free" : "Calculated at checkout"}</span>
          </div>
          {!freeShip && (
            <p className="mb-3 rounded-lg bg-white px-3 py-2 text-xs text-ink-soft">
              Add {formatPrice(SITE.freeShippingThreshold - subtotal)} more to unlock free shipping.
            </p>
          )}
          <Link href="/checkout" className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white hover:bg-brand-dark">
            Proceed to checkout <ArrowRight size={16} />
          </Link>
          <Link href="/shop" className="mt-2 block text-center text-sm font-semibold text-brand hover:underline">Continue shopping</Link>
          <p className="mt-4 text-center text-xs text-ink-soft">Need a custom size or finish? <Link href="/quote" className="font-semibold text-brand hover:underline">Request a quote</Link></p>
        </aside>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart, lineId } from "@/lib/cart";
import { formatPrice, SITE } from "@/lib/site";

export default function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, setQty, remove } = useCart();
  const freeShip = subtotal >= SITE.freeShippingThreshold;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-[90%] max-w-md flex-col bg-white"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <ShoppingCart size={20} /> Your Cart
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface">
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-surface text-ink-soft">
                  <ShoppingCart size={28} />
                </div>
                <p className="text-ink-soft">Your cart is empty.</p>
                <Link href="/shop" onClick={closeCart} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                  Browse boxes
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {items.map((i) => {
                    const id = lineId(i);
                    return (
                      <div key={id} className="flex gap-3 border-b border-line py-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line" style={{ background: `linear-gradient(135deg, ${i.image ? "transparent" : "#e9ecf0"}, #f6f7f9)` }}>
                          {i.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[10px] font-bold text-ink-soft">BOX</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/product/${i.slug}`} onClick={closeCart} className="line-clamp-2 text-sm font-semibold text-ink hover:text-brand">
                            {i.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-ink-soft">
                            {[i.variantLabel, i.colorName].filter(Boolean).join(" · ")}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-line">
                              <button onClick={() => setQty(id, i.qty - 1)} aria-label="Decrease" className="grid h-7 w-7 place-items-center rounded-full hover:bg-surface">
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                              <button onClick={() => setQty(id, i.qty + 1)} aria-label="Increase" className="grid h-7 w-7 place-items-center rounded-full hover:bg-surface">
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-ink">{formatPrice(i.price * i.qty)}</span>
                              <button onClick={() => remove(id)} aria-label="Remove" className="text-ink-soft hover:text-brand">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-line px-5 py-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-3 text-xs text-ink-soft">
                    {freeShip ? "🎉 Free shipping unlocked!" : `Add ${formatPrice(SITE.freeShippingThreshold - subtotal)} more for free shipping.`}
                  </p>
                  <Link href="/checkout" onClick={closeCart} className="block rounded-full bg-brand py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark">
                    Checkout
                  </Link>
                  <Link href="/cart" onClick={closeCart} className="mt-2 block rounded-full border border-line py-2.5 text-center text-sm font-semibold text-ink hover:border-brand hover:text-brand">
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

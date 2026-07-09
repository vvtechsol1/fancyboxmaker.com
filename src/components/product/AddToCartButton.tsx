"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";

export default function AddToCartButton({
  item,
  className = "",
  label = "Add to Cart",
}: {
  item: CartItem;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add({ ...item, qty: item.qty || 1 });
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-dark active:scale-[.98] ${className}`}
    >
      {added ? <Check size={15} /> : <ShoppingCart size={15} />}
      {added ? "Added" : label}
    </button>
  );
}

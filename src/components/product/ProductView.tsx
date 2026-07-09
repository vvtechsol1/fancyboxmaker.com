"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, Sparkles, PenTool, BadgeCheck, ShoppingCart, Check, Minus, Plus, FileText } from "lucide-react";
import type { Product, Variant } from "@/data/products";
import { discountPct } from "@/data/products";
import { formatPrice } from "@/lib/site";
import { track } from "@/lib/track";
import { useCart } from "@/lib/cart";
import ProductGallery from "./ProductGallery";
import Stars from "@/components/ui/Stars";

export default function ProductView({
  product,
  reviewCount,
  reviewAverage,
}: {
  product: Product;
  reviewCount?: number;
  reviewAverage?: number;
}) {
  const { add } = useCart();
  const ratingVal = reviewAverage ?? product.rating;
  const reviewsVal = reviewCount ?? product.reviews;
  const [color, setColor] = useState(product.colorway);
  const [variant, setVariant] = useState<Variant | null>(product.variants?.[0] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const price = variant?.price ?? product.price;
  const oldPrice = variant?.oldPrice ?? product.oldPrice;
  const inStock = variant ? variant.inStock : product.inStock;
  const selectionLabel = variant ? `${variant.label} · ${color.name}` : color.name;
  const off = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : discountPct(product);

  function handleAdd() {
    track("order", product.name, product.slug);
    add({
      slug: product.slug,
      name: product.name,
      boxTypeName: product.boxTypeName,
      type: product.type,
      price,
      image: product.images?.[0],
      colorName: color.name,
      variantLabel: variant?.label,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductGallery images={product.images} video={product.video} colorway={color} alt={product.name} />

      <div>
        <Link href={`/category/${product.boxType}`} className="text-xs font-semibold uppercase tracking-wide text-brand hover:underline">
          {product.boxTypeName}
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink font-display md:text-3xl">{product.name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <Stars rating={ratingVal} size={16} />
          <a href="#reviews" className="text-sm text-ink-soft hover:text-brand">{reviewsVal} reviews</a>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="text-3xl font-extrabold text-ink">{formatPrice(price)}</span>
          {oldPrice && <span className="text-lg text-ink-soft line-through">{formatPrice(oldPrice)}</span>}
          {off && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-sm font-bold text-brand">Save {off}%</span>}
        </div>
        <p className="mt-1 text-xs text-ink-soft">Price shown for the selected quantity · custom sizes &amp; finishes included</p>

        <div className="mt-3">
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">● In production — ships in 6–8 business days</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">● Made to order — request a quote for lead time</span>
          )}
        </div>

        {/* quantity tiers (variants) */}
        {product.variants?.length ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-ink">Quantity per order:</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setVariant(v)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${variant?.label === v.label ? "border-brand bg-brand-soft text-brand" : "border-line text-ink hover:border-brand"}`}
                >
                  {v.label}{v.price ? ` — ${formatPrice(v.price)}` : ""}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* colours / stock */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-ink">
            Base color: <span className="font-normal text-ink-soft">{color.name}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c)}
                title={c.name}
                aria-label={c.name}
                className={`h-9 w-9 rounded-full border-2 transition ${color.name === c.name ? "border-brand ring-2 ring-brand/20" : "border-line hover:border-ink-soft"}`}
                style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
              />
            ))}
          </div>
        </div>

        {/* qty stepper */}
        <div className="mt-6 flex items-center gap-3">
          <p className="text-sm font-semibold text-ink">Orders:</p>
          <div className="flex items-center gap-1 rounded-full border border-line">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface">
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-sm font-bold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* buy */}
        <div className="mt-7 space-y-2.5">
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition hover:bg-brand-dark active:scale-[.99]"
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
            {added ? "Added to cart" : "Add to Cart"}
          </button>
          <Link
            href="/quote"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-brand bg-white py-3 text-sm font-semibold text-brand transition hover:bg-brand-soft"
          >
            <FileText size={18} /> Get a Free Custom Quote
          </Link>
          <p className="text-center text-xs text-ink-soft">Free 3D mockup &amp; design · Free shipping over {formatPrice(250)} · No large minimums</p>
        </div>

        {/* trust */}
        <div className="mt-7 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-surface p-4">
          {[
            { Icon: Sparkles, t: "Free 3D Mockup", s: "See it before you print" },
            { Icon: PenTool, t: "Free Design Help", s: "Our team builds your die-line" },
            { Icon: Truck, t: "Free Shipping", s: "6–8 business-day turnaround" },
            { Icon: BadgeCheck, t: "Premium Finishes", s: "Foil, emboss, spot UV" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-2.5">
              <Icon size={20} className="shrink-0 text-brand" />
              <div>
                <p className="text-xs font-bold text-ink">{t}</p>
                <p className="text-[11px] text-ink-soft">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

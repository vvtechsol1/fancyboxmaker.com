import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { discountPct } from "@/data/products";
import { formatPrice } from "@/lib/site";
import BoxMockup from "./BoxMockup";
import AddToCartButton from "./AddToCartButton";
import Stars from "@/components/ui/Stars";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPct(product);
  const href = `/product/${product.slug}`;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      {/* badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {off && (
          <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            -{off}%
          </span>
        )}
        {product.isNew && !off && (
          <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">NEW</span>
        )}
        {product.isHot && (
          <span className="rounded-full bg-[var(--color-gold)] px-2.5 py-1 text-[11px] font-bold text-ink">🔥 HOT</span>
        )}
      </div>

      {!product.inStock && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white">
          Made to order
        </span>
      )}

      <Link href={href} className="relative block aspect-square overflow-hidden bg-surface">
        {product.images?.length ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <BoxMockup colorway={product.colorway} label={product.boxTypeName} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">{product.boxTypeName}</p>
        <Link href={href} className="mt-1 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2">
          <Stars rating={product.rating} reviews={product.reviews} size={13} />
        </div>

        {/* colour swatches */}
        <div className="mt-2.5 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
            />
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-ink">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-ink-soft line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <span className="text-[10px] text-ink-soft">/ 100 units</span>
        </div>

        <AddToCartButton
          className="mt-3 w-full"
          item={{
            slug: product.slug,
            name: product.name,
            boxTypeName: product.boxTypeName,
            type: product.type,
            price: product.price,
            image: product.images?.[0],
            colorName: product.colorway.name,
            variantLabel: product.variants?.[0]?.label,
            qty: 1,
          }}
        />
      </div>
    </div>
  );
}

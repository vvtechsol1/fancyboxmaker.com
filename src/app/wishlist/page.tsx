import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container-x py-20">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand">
          <Heart size={28} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">Your wishlist is empty</h1>
        <p className="mt-3 text-ink-soft">
          Save the box styles you love while you browse and they&apos;ll show up here.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-brand)] transition hover:bg-brand-dark"
        >
          Browse boxes
        </Link>
      </div>
    </div>
  );
}

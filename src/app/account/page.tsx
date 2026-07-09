import Link from "next/link";
import { User, Package, FileText, ShoppingBag, Heart } from "lucide-react";

export const metadata = { title: "My Account" };

const LINKS = [
  { label: "Track an order", href: "/track-order", icon: Package, desc: "See where your boxes are" },
  { label: "My quotes", href: "/quote", icon: FileText, desc: "Request or review a quote" },
  { label: "Cart", href: "/cart", icon: ShoppingBag, desc: "Items ready to order" },
  { label: "Wishlist", href: "/wishlist", icon: Heart, desc: "Boxes you saved" },
];

export default function AccountPage() {
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
            <User size={26} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">My Account</h1>
            <p className="text-ink-soft">Manage your orders, quotes and saved boxes.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 transition hover:border-brand hover:shadow-[var(--shadow-lift)]"
            >
              <l.icon size={22} className="mt-0.5 text-brand" />
              <span>
                <span className="block font-bold text-ink group-hover:text-brand">{l.label}</span>
                <span className="block text-sm text-ink-soft">{l.desc}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-line p-6 text-center">
          <p className="text-sm text-ink-soft">
            Full customer accounts with saved addresses and order history are coming soon. For now,
            place orders as a guest — you&apos;ll get an order reference to track your boxes.
          </p>
        </div>
      </div>
    </div>
  );
}

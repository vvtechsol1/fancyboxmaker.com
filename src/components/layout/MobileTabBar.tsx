"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, FileText, ShoppingCart, User } from "lucide-react";

const TABS = [
  { label: "Home", href: "/", icon: Home, external: false },
  { label: "Shop", href: "/shop", icon: Store, external: false },
  { label: "Quote", href: "/quote", icon: FileText, external: false },
  { label: "Cart", href: "/cart", icon: ShoppingCart, external: false, badge: 0 },
  { label: "Contact", href: "/contact", icon: User, external: false },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map((t) => {
          const active = !t.external && (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href));
          const Icon = t.icon;
          const inner = (
            <>
              {active && <span className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-brand" />}
              <span className="relative">
                <Icon size={22} className={active ? "text-brand" : "text-ink"} strokeWidth={active ? 2.4 : 1.8} />
                {"badge" in t && t.badge != null && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                    {t.badge}
                  </span>
                )}
              </span>
              <span className={`text-[11px] font-medium ${active ? "text-brand" : "text-ink-soft"}`}>{t.label}</span>
            </>
          );
          const cls = "relative flex flex-col items-center gap-1 px-2 pb-2 pt-2.5";
          return (
            <li key={t.label} className="flex-1">
              {t.external ? (
                <a href={t.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <Link href={t.href} className={cls}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

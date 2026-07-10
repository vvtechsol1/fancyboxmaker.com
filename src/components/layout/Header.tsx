"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu, X, ShoppingCart, ChevronDown, ChevronRight, Search, Heart, User,
  Phone, Mail, FileText, Sparkles,
} from "lucide-react";
import { categories } from "@/data/taxonomy";
import { useCart } from "@/lib/cart";
import { COLORWAYS } from "@/data/products";
import type { SiteSettings } from "@/lib/settings";
import BoxMockup from "@/components/product/BoxMockup";
import SearchBar from "./SearchBar";

const FEATURED = [
  { name: "Mailer Boxes", href: "/category/mailer-boxes", box: COLORWAYS.teal, tag: "Best seller" },
  { name: "Rigid Boxes", href: "/category/rigid-boxes", box: COLORWAYS.navy, tag: "Trending" },
];

function Logo({ settings }: { settings: SiteSettings }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${settings.brandName} home`}>
      {settings.logoImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={settings.logoImage} alt={settings.brandName} className="h-9 w-auto max-w-[190px] object-contain" />
      ) : (
        <>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white shadow-[var(--shadow-brand)]">
            <ShoppingCart size={18} />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink md:text-xl">
            {settings.logoText1}<span className="text-brand">{settings.logoText2}</span>
          </span>
        </>
      )}
    </Link>
  );
}

/** Thin promo + contact strip at the very top. */
function TopBar({ settings }: { settings: SiteSettings }) {
  const items = settings.announcements.length ? settings.announcements : [""];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, [items.length]);
  if (!settings.topbarEnabled) return null;
  return (
    <div className="text-white" style={{ background: settings.colorPrimary }}>
      <div className="container-x flex h-9 items-center justify-between text-xs">
        {/* promo (rotating) */}
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles size={13} className="shrink-0 text-white" />
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="truncate font-medium"
            >
              {items[idx % items.length]}
            </motion.span>
          </AnimatePresence>
        </div>
        {/* contact */}
        <div className="hidden items-center gap-5 sm:flex">
          <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-1.5 transition hover:text-white/70">
            <Phone size={13} /> {settings.phone}
          </a>
          <a href={`mailto:${settings.email}`} className="hidden items-center gap-1.5 transition hover:text-white/70 md:flex">
            <Mail size={13} /> {settings.email}
          </a>
        </div>
      </div>
    </div>
  );
}

function IconLink({
  href, label, onClick, badge, children,
}: {
  href?: string; label: string; onClick?: () => void; badge?: number; children: React.ReactNode;
}) {
  const cls =
    "relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-surface hover:text-brand";
  const inner = (
    <>
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>{inner}</button>
  ) : (
    <Link href={href!} aria-label={label} className={cls}>{inner}</Link>
  );
}

export default function Header({ settings }: { settings: SiteSettings }) {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMegaOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(true); };
  // small delay so moving the cursor from the trigger to the panel doesn't flicker it closed
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 120); };

  return (
    <header className={`sticky top-0 z-40 bg-cream ${scrolled ? "shadow-[var(--shadow-soft)]" : "border-b border-line"}`}>
      <TopBar settings={settings} />

      {/* Main nav bar + mega menu live together so hover/leave is seamless */}
      <div className="relative" onMouseLeave={scheduleClose}>
        <div className="container-x">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* LEFT: hamburger / All Products + Home */}
            <div className="flex items-center gap-1">
              {/* mobile hamburger → drawer */}
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg text-ink lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>

              {/* desktop: All Products mega trigger */}
              <button
                type="button"
                onMouseEnter={openMega}
                onClick={openMega}
                aria-expanded={megaOpen}
                className={`hidden items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition lg:flex ${
                  megaOpen ? "bg-brand text-white" : "bg-brand-soft text-brand hover:bg-brand hover:text-white"
                }`}
              >
                <Menu size={18} /> All Products
                <ChevronDown size={15} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              <Link href="/" onMouseEnter={scheduleClose} className="hidden rounded-lg px-3 py-2.5 text-sm font-bold text-ink transition hover:text-brand lg:block">
                Home
              </Link>
            </div>

            {/* CENTER: logo */}
            <div className="flex justify-center">
              <Logo settings={settings} />
            </div>

            {/* RIGHT: nav links + icons */}
            <div className="flex items-center justify-end gap-1">
              <nav className="mr-1 hidden items-center gap-1 xl:flex" onMouseEnter={scheduleClose}>
                {settings.navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2.5 text-sm font-bold text-ink transition hover:text-brand">
                    {l.label}
                  </Link>
                ))}
              </nav>

              <IconLink label="Search" onClick={() => setSearchOpen((v) => !v)}>
                <Search size={20} />
              </IconLink>
              <IconLink label={`Cart with ${count} item${count === 1 ? "" : "s"}`} onClick={openCart} badge={count}>
                <ShoppingCart size={20} />
              </IconLink>
              <span className="hidden items-center gap-1 sm:flex">
                <IconLink label="Wishlist" href="/wishlist">
                  <Heart size={20} />
                </IconLink>
                <IconLink label="My Account" href="/account">
                  <User size={20} />
                </IconLink>
              </span>
            </div>
          </div>
        </div>

        {/* Search bar drop-down */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-line bg-cream"
            >
              <div className="container-x py-3">
                <SearchBar autoFocus onSubmitted={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MEGA MENU */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              key="mega"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={openMega}
              className="absolute left-0 right-0 top-full z-40 hidden border-t border-line bg-white shadow-[var(--shadow-lift)] lg:block"
            >
              <div className="container-x py-8">
                <div className="grid grid-cols-12 gap-8">
                  {/* category columns */}
                  {categories.map((group) => (
                    <div key={group.slug} className="col-span-3">
                      <div className="mb-3 flex items-center justify-between border-b border-line pb-2">
                        <Link
                          href={`/collection/${group.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="text-sm font-extrabold uppercase tracking-wide text-brand hover:underline"
                        >
                          {group.name}
                        </Link>
                      </div>
                      <ul className="space-y-1">
                        {group.types.slice(0, 8).map((t) => (
                          <li key={t.slug}>
                            <Link
                              href={`/category/${t.slug}`}
                              onClick={() => setMegaOpen(false)}
                              className="flex items-center gap-1 rounded-md px-1 py-1 text-sm text-ink-soft transition hover:text-brand"
                            >
                              <ChevronRight size={13} className="text-line" /> {t.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {group.types.length > 8 && (
                        <Link
                          href={`/collection/${group.slug}`}
                          onClick={() => setMegaOpen(false)}
                          className="mt-2 inline-block text-xs font-bold text-green hover:underline"
                        >
                          View all {group.types.length} →
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* featured images */}
                  <div className="col-span-3 space-y-3 border-l border-line pl-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">Featured</p>
                    {FEATURED.map((f) => (
                      <Link
                        key={f.href}
                        href={f.href}
                        onClick={() => setMegaOpen(false)}
                        className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 transition hover:border-brand hover:shadow-[var(--shadow-lift)]"
                      >
                        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                          <BoxMockup colorway={f.box} label={f.name} />
                        </span>
                        <span>
                          <span className="block text-[11px] font-bold uppercase tracking-wide text-green">{f.tag}</span>
                          <span className="block text-sm font-bold text-ink group-hover:text-brand">{f.name}</span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/quote"
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
                    >
                      <FileText size={16} /> Get a Free 3D Mockup
                    </Link>
                  </div>
                </div>
              </div>

              {/* close toggle */}
              <button
                type="button"
                onClick={() => setMegaOpen(false)}
                aria-label="Close menu"
                className="absolute right-4 top-3 grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-surface hover:text-ink"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* click-outside backdrop for the mega menu */}
      {megaOpen && (
        <div className="fixed inset-0 top-[100px] z-30 hidden lg:block" onClick={() => setMegaOpen(false)} aria-hidden />
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} settings={settings} />}
      </AnimatePresence>
    </header>
  );
}

function MobileDrawer({ onClose, settings }: { onClose: () => void; settings: SiteSettings }) {
  const [openCat, setOpenCat] = useState<string | null>(null);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={onClose}
      />
      <motion.aside
        initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-white lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            {settings.logoText1}<span className="text-brand">{settings.logoText2}</span>
          </span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface">
            <X size={22} />
          </button>
        </div>

        <div className="border-b border-line px-4 py-3">
          <SearchBar onSubmitted={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-ink-soft">All Products</p>
          {categories.map((c) => (
            <div key={c.slug} className="border-b border-line/70">
              <button
                type="button"
                onClick={() => setOpenCat(openCat === c.slug ? null : c.slug)}
                className="flex w-full items-center justify-between px-3 py-3 text-sm font-semibold text-ink"
              >
                {c.name}
                <ChevronDown size={16} className={`transition-transform ${openCat === c.slug ? "rotate-180 text-brand" : "text-ink-soft"}`} />
              </button>
              <AnimatePresence>
                {openCat === c.slug && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-1 px-3 pb-3">
                      <Link href={`/collection/${c.slug}`} onClick={onClose} className="col-span-2 py-1.5 text-sm font-semibold text-brand">
                        View all {c.name} →
                      </Link>
                      {c.types.map((t) => (
                        <Link key={t.slug} href={`/category/${t.slug}`} onClick={onClose} className="truncate py-1.5 text-sm text-ink-soft">
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="mt-3">
            {settings.navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={onClose} className="block px-3 py-3 text-sm font-semibold text-ink">
                {l.label}
              </Link>
            ))}
            <Link href="/wishlist" onClick={onClose} className="block px-3 py-3 text-sm font-semibold text-ink">Wishlist</Link>
            <Link href="/account" onClick={onClose} className="block px-3 py-3 text-sm font-semibold text-ink">My Account</Link>
          </div>
        </div>

        <div className="border-t border-line p-4">
          <Link href="/quote" onClick={onClose} className="flex items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-white">
            <FileText size={16} /> Get a Free Quote
          </Link>
        </div>
      </motion.aside>
    </>
  );
}

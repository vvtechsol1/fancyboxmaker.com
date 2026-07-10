"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, LogOut, ExternalLink, Loader2, Package, BarChart3,
  ShoppingBag, FileText, Palette, Menu, X, LayoutDashboard,
} from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/site";
import BoxMockup from "@/components/product/BoxMockup";
import AdminProductForm from "./AdminProductForm";
import StatsPanel from "./StatsPanel";
import OrdersPanel from "./OrdersPanel";
import QuotesPanel from "./QuotesPanel";
import CustomizePanel from "./CustomizePanel";

type View = "list" | "form" | "stats" | "orders" | "quotes" | "customize";

const NAV = [
  { key: "list", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "quotes", label: "Quotes", icon: FileText },
  { key: "customize", label: "Customize", icon: Palette },
  { key: "stats", label: "Stats", icon: BarChart3 },
] as const;

export default function AdminApp() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [view, setView] = useState<View>("list");
  const [editing, setEditing] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (data.ok) setProducts(data.products);
  }
  useEffect(() => { load(); }, []);

  async function remove(slug: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  function go(v: View) {
    setView(v);
    setEditing(null);
    setNavOpen(false);
  }

  const activeKey: View = view === "form" ? "list" : view;
  const title = view === "form" ? (editing ? "Edit product" : "Add product") : (NAV.find((n) => n.key === activeKey)?.label ?? "Products");

  const list = (products ?? []).filter(
    (p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.categoryName.toLowerCase().includes(q.toLowerCase()) || p.boxTypeName.toLowerCase().includes(q.toLowerCase())
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white shadow-[var(--shadow-brand)]">
          <LayoutDashboard size={18} />
        </span>
        <div className="leading-tight">
          <div className="font-display text-sm font-extrabold tracking-tight text-ink">FancyBoxMaker</div>
          <div className="text-[11px] text-ink-soft">Admin dashboard</div>
        </div>
        <button type="button" onClick={() => setNavOpen(false)} className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-surface lg:hidden">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => go(key)}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
              activeKey === key ? "bg-brand text-white shadow-[var(--shadow-brand)]" : "text-ink-soft hover:bg-surface hover:text-ink"
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>

      <div className="space-y-1 border-t border-line p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-surface hover:text-ink">
          <ExternalLink size={18} /> View store
        </Link>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-surface hover:text-brand">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line bg-white lg:block">
        {sidebar}
      </aside>

      {/* mobile drawer */}
      {navOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={() => setNavOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden">{sidebar}</aside>
        </>
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <button type="button" onClick={() => setNavOpen(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-lg text-ink hover:bg-surface lg:hidden">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-display text-lg font-extrabold text-ink">{title}</h1>
            {view === "list" && <p className="text-xs text-ink-soft">{products ? `${products.length} products` : "Loading…"}</p>}
          </div>
          {activeKey === "list" && view !== "form" && (
            <button
              onClick={() => { setEditing(null); setView("form"); }}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Add product</span>
            </button>
          )}
        </header>

        <div className="p-4 md:p-6">
          {view === "customize" ? (
            <CustomizePanel />
          ) : view === "stats" ? (
            <StatsPanel />
          ) : view === "orders" ? (
            <OrdersPanel />
          ) : view === "quotes" ? (
            <QuotesPanel />
          ) : view === "form" ? (
            <AdminProductForm
              initial={editing}
              onSaved={() => { setView("list"); setEditing(null); load(); }}
              onCancel={() => { setView("list"); setEditing(null); }}
            />
          ) : (
            <>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="mb-4 h-11 w-full max-w-md rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
              {products === null ? (
                <div className="grid place-items-center py-20 text-ink-soft"><Loader2 className="animate-spin" /></div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-surface text-left text-xs uppercase tracking-wide text-ink-soft">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="hidden px-4 py-3 md:table-cell">Category / Box type</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="hidden px-4 py-3 sm:table-cell">Stock</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {list.map((p) => (
                        <tr key={p.slug} className="hover:bg-surface/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                                {p.images?.length ? (
                                  <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />
                                ) : (
                                  <BoxMockup colorway={p.colorway} />
                                )}
                              </div>
                              <span className="line-clamp-2 max-w-[280px] font-medium text-ink">{p.name}</span>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{p.categoryName}<br /><span className="text-xs">{p.boxTypeName}</span></td>
                          <td className="px-4 py-3 font-semibold text-ink">{formatPrice(p.price)}</td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            {p.inStock ? <span className="text-green-700">In stock</span> : <span className="text-brand">Out</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/product/${p.slug}`} target="_blank" className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-ink" title="View"><ExternalLink size={15} /></Link>
                              <button onClick={() => { setEditing(p); setView("form"); }} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-brand" title="Edit"><Pencil size={15} /></button>
                              <button onClick={() => remove(p.slug)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-brand" title="Delete"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {list.length === 0 && <p className="px-4 py-10 text-center text-ink-soft">No products found.</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

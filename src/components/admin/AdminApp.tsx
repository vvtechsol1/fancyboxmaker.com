"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, LogOut, ExternalLink, Loader2, Package, BarChart3, ShoppingBag, FileText, Palette } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/site";
import BoxMockup from "@/components/product/BoxMockup";
import AdminProductForm from "./AdminProductForm";
import StatsPanel from "./StatsPanel";
import OrdersPanel from "./OrdersPanel";
import QuotesPanel from "./QuotesPanel";
import CustomizePanel from "./CustomizePanel";

type View = "list" | "form" | "stats" | "orders" | "quotes" | "customize";

export default function AdminApp() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [view, setView] = useState<View>("list");
  const [editing, setEditing] = useState<Product | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (data.ok) setProducts(data.products);
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(slug: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  const list = (products ?? []).filter(
    (p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.categoryName.toLowerCase().includes(q.toLowerCase()) || p.boxTypeName.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container-x py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink font-display">Product Admin</h1>
          <p className="text-sm text-ink-soft">{products ? `${products.length} products` : "Loading…"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface">
            <ExternalLink size={15} /> View store
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {view !== "form" && (
        <div className="mb-5 flex flex-wrap gap-1 border-b border-line">
          {([
            ["list", "Products", Package],
            ["orders", "Orders", ShoppingBag],
            ["quotes", "Quotes", FileText],
            ["customize", "Customize", Palette],
            ["stats", "Stats", BarChart3],
          ] as const).map(([v, lbl, Icon]) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${view === v ? "border-brand text-brand" : "border-transparent text-ink-soft hover:text-ink"}`}
            >
              <Icon size={16} /> {lbl}
            </button>
          ))}
        </div>
      )}

      {view === "customize" ? (
        <CustomizePanel />
      ) : view === "stats" ? (
        <StatsPanel />
      ) : view === "orders" ? (
        <OrdersPanel />
      ) : view === "quotes" ? (
        <QuotesPanel />
      ) : view === "form" ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">{editing ? "Edit product" : "Add new product"}</h2>
          </div>
          <AdminProductForm
            initial={editing}
            onSaved={() => { setView("list"); setEditing(null); load(); }}
            onCancel={() => { setView("list"); setEditing(null); }}
          />
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="h-11 flex-1 min-w-[200px] rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
            <button
              onClick={() => { setEditing(null); setView("form"); }}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark"
            >
              <Plus size={17} /> Add product
            </button>
          </div>

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
  );
}

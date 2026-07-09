"use client";

import { Fragment, useEffect, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/site";

type OrderItem = { name: string; qty: number; price: number; variantLabel?: string; colorName?: string };
type Order = {
  ref: string;
  createdAt: string;
  status: string;
  subtotal: number;
  items: OrderItem[];
  customer: { name: string; email: string; phone?: string; company?: string };
  shipping: { address?: string; city?: string; state?: string; zip?: string; country?: string };
  notes?: string;
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.ok ? d.orders : []))
      .catch(() => setOrders([]));
  }, []);

  if (orders === null) return <div className="grid place-items-center py-20 text-ink-soft"><Loader2 className="animate-spin" /></div>;
  if (orders.length === 0) return <p className="rounded-2xl border border-line bg-white px-4 py-10 text-center text-ink-soft">No order requests yet.</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-4 py-3">Ref</th>
            <th className="hidden px-4 py-3 sm:table-cell">Date</th>
            <th className="px-4 py-3">Customer</th>
            <th className="hidden px-4 py-3 md:table-cell">Items</th>
            <th className="px-4 py-3">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((o) => (
            <Fragment key={o.ref}>
              <tr className="cursor-pointer hover:bg-surface/50" onClick={() => setOpen(open === o.ref ? null : o.ref)}>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-ink">{o.ref}</td>
                <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-ink">{o.customer.name}</span>
                  <br /><span className="text-xs text-ink-soft">{o.customer.email}</span>
                </td>
                <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                <td className="px-4 py-3 font-semibold text-ink">
                  <span className="inline-flex items-center gap-1">{formatPrice(o.subtotal)} <ChevronDown size={14} className={`transition ${open === o.ref ? "rotate-180" : ""}`} /></span>
                </td>
              </tr>
              {open === o.ref && (
                <tr className="bg-surface/40">
                  <td colSpan={5} className="px-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">Items</p>
                        <ul className="space-y-1 text-sm text-ink">
                          {o.items.map((i, idx) => (
                            <li key={idx}>{i.qty}× {i.name} <span className="text-ink-soft">{[i.variantLabel, i.colorName].filter(Boolean).join(" · ")}</span> — {formatPrice(i.price * i.qty)}</li>
                          ))}
                        </ul>
                        {o.notes ? <p className="mt-2 text-sm text-ink-soft"><span className="font-semibold text-ink">Notes:</span> {o.notes}</p> : null}
                      </div>
                      <div className="text-sm text-ink">
                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">Ship to</p>
                        {o.customer.company ? <p>{o.customer.company}</p> : null}
                        <p>{o.shipping.address}</p>
                        <p>{[o.shipping.city, o.shipping.state, o.shipping.zip].filter(Boolean).join(", ")}</p>
                        <p>{o.shipping.country}</p>
                        {o.customer.phone ? <p className="mt-1 text-ink-soft">📞 {o.customer.phone}</p> : null}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

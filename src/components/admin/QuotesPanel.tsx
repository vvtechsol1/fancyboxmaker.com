"use client";

import { Fragment, useEffect, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

type Quote = {
  ref: string;
  createdAt: string;
  status: string;
  boxType?: string;
  dimensions?: { length?: string; width?: string; depth?: string; unit?: string };
  quantity?: string;
  material?: string;
  finishes?: string[];
  color?: string;
  artwork?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
};

export default function QuotesPanel() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((d) => setQuotes(d.ok ? d.quotes : []))
      .catch(() => setQuotes([]));
  }, []);

  if (quotes === null) return <div className="grid place-items-center py-20 text-ink-soft"><Loader2 className="animate-spin" /></div>;
  if (quotes.length === 0) return <p className="rounded-2xl border border-line bg-white px-4 py-10 text-center text-ink-soft">No quote requests yet.</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-4 py-3">Ref</th>
            <th className="hidden px-4 py-3 sm:table-cell">Date</th>
            <th className="px-4 py-3">Customer</th>
            <th className="hidden px-4 py-3 md:table-cell">Box type</th>
            <th className="px-4 py-3">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {quotes.map((q) => {
            const d = q.dimensions;
            const dims = d && (d.length || d.width || d.depth) ? `${d.length || "?"} × ${d.width || "?"} × ${d.depth || "?"} ${d.unit || ""}` : "—";
            return (
              <Fragment key={q.ref}>
                <tr className="cursor-pointer hover:bg-surface/50" onClick={() => setOpen(open === q.ref ? null : q.ref)}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-ink">{q.ref}</td>
                  <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">{q.name}</span>
                    <br /><span className="text-xs text-ink-soft">{q.email}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{q.boxType || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    <span className="inline-flex items-center gap-1">{q.quantity || "—"} <ChevronDown size={14} className={`transition ${open === q.ref ? "rotate-180" : ""}`} /></span>
                  </td>
                </tr>
                {open === q.ref && (
                  <tr className="bg-surface/40">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="grid gap-x-8 gap-y-1 text-sm text-ink md:grid-cols-2">
                        <p><span className="font-semibold">Dimensions:</span> {dims}</p>
                        <p><span className="font-semibold">Material:</span> {q.material || "—"}</p>
                        <p><span className="font-semibold">Finishes:</span> {q.finishes?.length ? q.finishes.join(", ") : "—"}</p>
                        <p><span className="font-semibold">Color:</span> {q.color || "—"}</p>
                        {q.company ? <p><span className="font-semibold">Company:</span> {q.company}</p> : null}
                        {q.phone ? <p><span className="font-semibold">Phone:</span> {q.phone}</p> : null}
                        {q.artwork ? <p className="md:col-span-2"><span className="font-semibold">Artwork:</span> <a href={q.artwork} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline break-all">{q.artwork}</a></p> : null}
                        {q.notes ? <p className="md:col-span-2"><span className="font-semibold">Notes:</span> {q.notes}</p> : null}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

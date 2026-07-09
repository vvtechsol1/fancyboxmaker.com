"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Search, MessageCircle, Loader2, RotateCcw, TrendingUp, Smartphone, Monitor } from "lucide-react";
import { formatNumber } from "@/lib/site";

type Row = { label: string; count: number };
type Stats = {
  totals: { visits: number; visitsToday: number; visitsWeek: number; searches: number; orderClicks: number; events: number };
  deviceViews: { mobile: number; desktop: number };
  live: { mobile: number; desktop: number; total: number };
  topPages: Row[];
  topSearches: Row[];
  topOrders: Row[];
};

function BarList({ rows, empty }: { rows: Row[]; empty: string }) {
  if (!rows.length) return <p className="px-1 py-6 text-center text-sm text-ink-soft">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-ink" title={r.label}>{r.label}</span>
            <span className="shrink-0 font-bold text-ink">{formatNumber(r.count)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setStats(data.stats);
    } catch {
      /* keep previous */
    }
  }

  useEffect(() => {
    refresh();
    timer.current = setInterval(refresh, 5000); // real-time auto-refresh
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  async function reset() {
    if (!confirm("Reset all stats to zero? This cannot be undone.")) return;
    await fetch("/api/admin/stats", { method: "DELETE" });
    refresh();
  }

  if (!stats) return <div className="grid place-items-center py-20 text-ink-soft"><Loader2 className="animate-spin" /></div>;

  const live = stats.live ?? { mobile: 0, desktop: 0, total: 0 };
  const dv = stats.deviceViews ?? { mobile: 0, desktop: 0 };
  const dvTotal = dv.mobile + dv.desktop;

  const cards = [
    { Icon: Eye, label: "Total Visits", value: stats.totals.visits, sub: `${stats.totals.visitsToday} today · ${stats.totals.visitsWeek} this week` },
    { Icon: Search, label: "Searches", value: stats.totals.searches, sub: "products & devices searched" },
    { Icon: MessageCircle, label: "WhatsApp Order Clicks", value: stats.totals.orderClicks, sub: "buy / order button taps" },
  ];

  return (
    <div>
      {/* LIVE NOW */}
      <div className="mb-6 rounded-2xl border border-line bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-bold text-ink">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            Live visitors right now
          </h3>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-surface hover:text-brand">
            <RotateCcw size={13} /> Reset stats
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-surface p-4 text-center">
            <p className="text-4xl font-extrabold text-ink font-display">{formatNumber(live.total)}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">On site now</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line p-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand"><Smartphone size={20} /></span>
            <div>
              <p className="text-2xl font-extrabold text-ink">{formatNumber(live.mobile)}</p>
              <p className="text-xs text-ink-soft">on Mobile</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line p-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand"><Monitor size={20} /></span>
            <div>
              <p className="text-2xl font-extrabold text-ink">{formatNumber(live.desktop)}</p>
              <p className="text-xs text-ink-soft">on Desktop</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-ink-soft">Live &amp; real — counts active sessions from the last 30 seconds. Auto-refreshes every 5s.</p>
      </div>

      {/* summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ Icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand"><Icon size={20} /></span>
              <TrendingUp size={18} className="text-ink-soft/40" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-ink font-display">{formatNumber(value)}</p>
            <p className="text-sm font-semibold text-ink">{label}</p>
            <p className="text-xs text-ink-soft">{sub}</p>
          </div>
        ))}
      </div>

      {/* device split (all-time) */}
      <div className="mt-4 rounded-2xl border border-line bg-white p-5">
        <h3 className="mb-3 font-bold text-ink">Mobile vs Desktop — all visits</h3>
        <div className="flex h-4 overflow-hidden rounded-full bg-surface">
          <div className="h-full bg-brand" style={{ width: `${dvTotal ? (dv.mobile / dvTotal) * 100 : 0}%` }} />
          <div className="h-full bg-ink/70" style={{ width: `${dvTotal ? (dv.desktop / dvTotal) * 100 : 0}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand" /> Mobile <b className="text-ink">{formatNumber(dv.mobile)}</b> <span className="text-ink-soft">({dvTotal ? Math.round((dv.mobile / dvTotal) * 100) : 0}%)</span></span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-ink/70" /> Desktop <b className="text-ink">{formatNumber(dv.desktop)}</b> <span className="text-ink-soft">({dvTotal ? Math.round((dv.desktop / dvTotal) * 100) : 0}%)</span></span>
        </div>
      </div>

      {/* breakdowns */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-ink"><Eye size={16} className="text-brand" /> Most visited pages</h3>
          <BarList rows={stats.topPages} empty="No visits yet." />
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-ink"><Search size={16} className="text-brand" /> Most searched</h3>
          <BarList rows={stats.topSearches} empty="No searches yet." />
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-ink"><MessageCircle size={16} className="text-brand" /> Most WhatsApp order clicks</h3>
          <BarList rows={stats.topOrders} empty="No order clicks yet." />
        </div>
      </div>
    </div>
  );
}

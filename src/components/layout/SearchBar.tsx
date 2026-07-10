"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Layers, Tag, Package } from "lucide-react";
import type { BoxCategory } from "@/data/taxonomy";
import { track } from "@/lib/track";

type Item = { label: string; sub: string; href: string; kind: "boxtype" | "category" | "product" };

function taxonomyIndex(categories: BoxCategory[]): Item[] {
  const items: Item[] = [];
  for (const c of categories) {
    items.push({ label: c.name, sub: "Category", href: `/collection/${c.slug}`, kind: "category" });
    for (const t of c.types) {
      items.push({ label: t.name, sub: c.name, href: `/category/${t.slug}`, kind: "boxtype" });
    }
  }
  return items;
}

export default function SearchBar({
  className = "",
  autoFocus = false,
  onSubmitted,
  categories,
}: {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  categories: BoxCategory[];
}) {
  const router = useRouter();
  const [prod, setProd] = useState<{ name: string; slug: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => setProd(d.products || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const index = useMemo<Item[]>(() => {
    const base = taxonomyIndex(categories);
    const products: Item[] = prod.map((p) => ({ label: p.name, sub: "Product", href: `/product/${p.slug}`, kind: "product" }));
    return [...products, ...base];
  }, [prod, categories]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    const scored = index
      .filter((i) => i.label.toLowerCase().includes(t))
      .sort((a, b) => a.label.toLowerCase().indexOf(t) - b.label.toLowerCase().indexOf(t));
    return scored.slice(0, 8);
  }, [q, index]);

  function go(href: string, label?: string) {
    if (label) track("search", label);
    setOpen(false);
    setQ("");
    onSubmitted?.();
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) go(results[0].href, results[0].label);
    else if (q.trim()) {
      track("search", q.trim());
      go(`/shop?q=${encodeURIComponent(q.trim())}`);
    }
  }

  const Icon = (k: Item["kind"]) => (k === "category" ? Layers : k === "product" ? Package : Tag);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={onSubmit} className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 150);
          }}
          type="search"
          placeholder="Search boxes (mailer, rigid, kraft, pizza, cosmetic…)"
          className="w-full rounded-full border border-line bg-surface py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
          aria-label="Search custom boxes"
        />
      </form>

      {open && results.length > 0 && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          {results.map((r) => {
            const I = Icon(r.kind);
            return (
              <button
                key={r.href + r.label}
                onClick={() => go(r.href, r.label)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-surface"
              >
                <I size={16} className="text-brand" />
                <span className="flex-1 truncate text-sm font-medium text-ink">{r.label}</span>
                <span className="text-[11px] text-ink-soft">{r.sub}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2, X, Check, FolderTree } from "lucide-react";
import type { BoxCategory } from "@/data/taxonomy";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function CategoriesPanel() {
  const [cats, setCats] = useState<BoxCategory[] | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [newType, setNewType] = useState<Record<string, string>>({});
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    fetch("/api/admin/taxonomy")
      .then((r) => r.json() as Promise<{ ok: boolean; categories?: BoxCategory[] }>)
      .then((d) => {
        if (d.ok && d.categories) {
          setCats(d.categories);
          setSaved(JSON.stringify(d.categories));
        }
      })
      .catch(() => {});
  }, []);

  const dirty = !!cats && JSON.stringify(cats) !== saved;

  function update(next: BoxCategory[]) {
    setCats(next);
    setStatus("idle");
  }

  function addType(groupSlug: string) {
    const name = (newType[groupSlug] || "").trim();
    if (!name || !cats) return;
    const slug = slugify(name);
    update(
      cats.map((c) =>
        c.slug === groupSlug && !c.types.some((t) => t.slug === slug)
          ? { ...c, types: [...c.types, { name, slug }] }
          : c
      )
    );
    setNewType((m) => ({ ...m, [groupSlug]: "" }));
  }

  function removeType(groupSlug: string, typeSlug: string) {
    if (!cats) return;
    update(cats.map((c) => (c.slug === groupSlug ? { ...c, types: c.types.filter((t) => t.slug !== typeSlug) } : c)));
  }

  function renameGroup(groupSlug: string, name: string) {
    if (!cats) return;
    update(cats.map((c) => (c.slug === groupSlug ? { ...c, name } : c)));
  }

  function removeGroup(groupSlug: string) {
    if (!cats || !confirm("Delete this whole category group and all its types?")) return;
    update(cats.filter((c) => c.slug !== groupSlug));
  }

  function addGroup() {
    const name = newGroup.trim();
    if (!name || !cats) return;
    const slug = slugify(name);
    if (cats.some((c) => c.slug === slug)) return;
    update([...cats, { slug, name, types: [] }]);
    setNewGroup("");
  }

  async function save() {
    if (!cats) return;
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/taxonomy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: cats }),
      });
      const d = (await res.json()) as { ok: boolean; categories?: BoxCategory[] };
      if (d.ok && d.categories) {
        setCats(d.categories);
        setSaved(JSON.stringify(d.categories));
        setStatus("ok");
      } else setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (!cats) {
    return <div className="grid place-items-center py-24 text-ink-soft"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="pb-24">
      <p className="mb-5 max-w-2xl text-sm text-ink-soft">
        Manage the categories that appear in the shop menu, the homepage grid and product filters.
        Add or remove box types under each group, then <strong>Save</strong>.
      </p>

      <div className="space-y-4">
        {cats.map((group) => (
          <section key={group.slug} className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <FolderTree size={18} className="text-brand" />
              <input
                value={group.name}
                onChange={(e) => renameGroup(group.slug, e.target.value)}
                className="flex-1 rounded-lg border border-transparent bg-transparent px-1 text-base font-bold text-ink outline-none hover:border-line focus:border-brand"
              />
              <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink-soft">{group.types.length}</span>
              <button type="button" onClick={() => removeGroup(group.slug)} aria-label="Delete group" className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-brand">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.types.map((t) => (
                <span key={t.slug} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-1.5 text-sm font-medium text-ink">
                  {t.name}
                  <button type="button" onClick={() => removeType(group.slug, t.slug)} aria-label={`Remove ${t.name}`} className="grid h-5 w-5 place-items-center rounded-full text-ink-soft hover:bg-brand hover:text-white">
                    <X size={13} />
                  </button>
                </span>
              ))}
              {group.types.length === 0 && <span className="text-sm text-ink-soft">No types yet.</span>}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                value={newType[group.slug] || ""}
                onChange={(e) => setNewType((m) => ({ ...m, [group.slug]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addType(group.slug); } }}
                placeholder="New box type, e.g. Wine Boxes"
                className={`${inputCls} max-w-xs`}
              />
              <button type="button" onClick={() => addType(group.slug)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-semibold text-ink hover:bg-surface">
                <Plus size={15} /> Add
              </button>
            </div>
          </section>
        ))}
      </div>

      {/* add group */}
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-line p-5">
        <input
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGroup(); } }}
          placeholder="New category group, e.g. Seasonal"
          className={`${inputCls} max-w-xs`}
        />
        <button type="button" onClick={addGroup} className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus size={15} /> Add group
        </button>
      </div>

      {/* sticky save bar */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
          <div className="container-x flex items-center justify-between gap-3 py-3">
            <span className="text-sm font-medium text-ink-soft">
              {status === "error" ? <span className="text-red-600">Couldn&apos;t save — try again.</span> : "Unsaved category changes."}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setCats(JSON.parse(saved)); setStatus("idle"); }} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface">Discard</button>
              <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save changes
              </button>
            </div>
          </div>
        </div>
      )}
      {status === "ok" && !dirty && (
        <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lg">
          <Check size={16} className="text-green" /> Saved &amp; live
        </div>
      )}
    </div>
  );
}

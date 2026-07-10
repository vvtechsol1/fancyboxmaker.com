"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2, Save, Plus, Trash2, Upload, X, Check, Sparkles, Palette,
  LayoutTemplate, Image as ImageIcon, PanelBottom, Phone, Search,
} from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

type SectionKey = "branding" | "colors" | "header" | "hero" | "footer" | "contact" | "seo";

const SECTIONS: { key: SectionKey; label: string; icon: typeof Sparkles }[] = [
  { key: "branding", label: "Branding", icon: Sparkles },
  { key: "colors", label: "Theme Colors", icon: Palette },
  { key: "header", label: "Header & Top Bar", icon: LayoutTemplate },
  { key: "hero", label: "Hero Banner", icon: ImageIcon },
  { key: "footer", label: "Footer", icon: PanelBottom },
  { key: "contact", label: "Contact & Social", icon: Phone },
  { key: "seo", label: "SEO", icon: Search },
];

const inputCls =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";
const areaCls =
  "min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

/* ── small building blocks ─────────────────────────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink-soft">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Card({ icon: Icon, title, children }: { icon: typeof Sparkles; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-ink">
        <Icon size={19} className="text-brand" /> {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ColorField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="text-sm font-semibold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink-soft">{hint}</span>}
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-line bg-white p-1"
        />
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder="#000000" />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
      aria-pressed={checked}
    >
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-brand" : "bg-line"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </button>
  );
}

function ListEditor({ items, onChange, placeholder, addLabel }: { items: string[]; onChange: (v: string[]) => void; placeholder: string; addLabel: string }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={it}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={placeholder}
            className={inputCls}
          />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-brand">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink hover:bg-surface">
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}

function LinkListEditor({ items, onChange }: { items: { label: string; href: string }[]; onChange: (v: { label: string; href: string }[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={it.label} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} placeholder="Label" className={inputCls} />
          <input value={it.href} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} placeholder="/href" className={inputCls} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-surface hover:text-brand">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { label: "", href: "/" }])} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink hover:bg-surface">
        <Plus size={15} /> Add link
      </button>
    </div>
  );
}

function ImageUpload({ label, hint, value, onChange, previewClass }: { label: string; hint?: string; value: string; onChange: (v: string) => void; previewClass: string }) {
  const ref = useRef<HTMLInputElement>(null);
  function pick(file?: File) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(String(r.result));
    r.readAsDataURL(file);
  }
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-4">
        <div className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface ${previewClass}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="h-full w-full object-contain" />
          ) : (
            <ImageIcon size={20} className="text-ink-soft" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          <button type="button" onClick={() => ref.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface">
            <Upload size={15} /> Upload
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-brand">
              <X size={15} /> Remove
            </button>
          )}
        </div>
      </div>
    </Field>
  );
}

/* ── main panel ────────────────────────────────────────────── */

export default function CustomizePanel() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState<SiteSettings | null>(null);
  const [active, setActive] = useState<SectionKey>("branding");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json() as Promise<{ ok: boolean; settings?: SiteSettings }>)
      .then((d) => {
        if (d.ok && d.settings) {
          setS(d.settings);
          setSaved(d.settings);
        }
      })
      .catch(() => {});
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setS((prev) => (prev ? { ...prev, [key]: value } : prev));
    setStatus("idle");
  }

  const dirty = !!s && !!saved && JSON.stringify(s) !== JSON.stringify(saved);

  async function save() {
    if (!s) return;
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const d = (await res.json()) as { ok: boolean; settings?: SiteSettings };
      if (d.ok && d.settings) {
        setS(d.settings);
        setSaved(d.settings);
        setStatus("ok");
      } else setStatus("error");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (!s) {
    return (
      <div className="grid place-items-center py-24 text-ink-soft">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* section nav */}
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {SECTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition lg:w-full ${
                  active === key ? "bg-brand text-white shadow-[var(--shadow-brand)]" : "text-ink-soft hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon size={17} /> {label}
              </button>
            ))}
          </div>
        </nav>

        {/* section body */}
        <div className="space-y-6">
          {active === "branding" && (
            <Card icon={Sparkles} title="Branding">
              <Field label="Brand name" hint="Used in the browser tab, SEO and alt text.">
                <input value={s.brandName} onChange={(e) => set("brandName", e.target.value)} className={inputCls} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Wordmark — part 1"><input value={s.logoText1} onChange={(e) => set("logoText1", e.target.value)} className={inputCls} /></Field>
                <Field label="Wordmark — part 2 (accent)"><input value={s.logoText2} onChange={(e) => set("logoText2", e.target.value)} className={inputCls} /></Field>
              </div>
              <div className="rounded-xl border border-line bg-surface px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Preview</span>
                <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-ink">
                  {s.logoText1}<span className="text-brand">{s.logoText2}</span>
                </div>
              </div>
              <ImageUpload label="Logo image" hint="Optional — overrides the text logo. PNG/SVG, ~190×40." value={s.logoImage} onChange={(v) => set("logoImage", v)} previewClass="h-12 w-28" />
              <ImageUpload label="Favicon" hint="Browser-tab icon. Square PNG/SVG/ICO." value={s.favicon} onChange={(v) => set("favicon", v)} previewClass="h-12 w-12" />
            </Card>
          )}

          {active === "colors" && (
            <Card icon={Palette} title="Theme Colors">
              <div className="overflow-hidden rounded-xl border border-line">
                <div className="px-4 py-2.5 text-sm font-bold text-white" style={{ background: s.colorPrimary }}>Header / top bar preview</div>
                <div className="flex items-center gap-3 p-4" style={{ background: s.colorBg }}>
                  <button type="button" className="rounded-full px-4 py-2 text-sm font-bold text-white" style={{ background: s.colorPrimary }}>Primary button</button>
                  <button type="button" className="rounded-full px-4 py-2 text-sm font-bold text-white" style={{ background: s.colorSecondary }}>Secondary</button>
                  <span className="text-sm font-semibold" style={{ color: s.colorInk }}>Heading text</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ColorField label="Primary" hint="Main brand colour — header, buttons, links." value={s.colorPrimary} onChange={(v) => set("colorPrimary", v)} />
                <ColorField label="Primary (dark)" hint="Hover state of primary." value={s.colorPrimaryDark} onChange={(v) => set("colorPrimaryDark", v)} />
                <ColorField label="Secondary" hint="Accent — step icons, highlights." value={s.colorSecondary} onChange={(v) => set("colorSecondary", v)} />
                <ColorField label="Page background" hint="The warm base behind content." value={s.colorBg} onChange={(v) => set("colorBg", v)} />
                <ColorField label="Text / headings" value={s.colorInk} onChange={(v) => set("colorInk", v)} />
              </div>
            </Card>
          )}

          {active === "header" && (
            <Card icon={LayoutTemplate} title="Header & Top Bar">
              <Toggle checked={s.topbarEnabled} onChange={(v) => set("topbarEnabled", v)} label="Show top bar (promo + contact)" />
              <Field label="Rotating announcements" hint="Shown one at a time in the top bar.">
                <ListEditor items={s.announcements} onChange={(v) => set("announcements", v)} placeholder="🚚 Free shipping over $250" addLabel="Add announcement" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone"><input value={s.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></Field>
                <Field label="Email"><input type="email" value={s.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
              </div>
              <Field label="Navigation links" hint="Shown on the right of the header (desktop).">
                <LinkListEditor items={s.navLinks} onChange={(v) => set("navLinks", v)} />
              </Field>
            </Card>
          )}

          {active === "hero" && (
            <Card icon={ImageIcon} title="Hero Banner">
              <Field label="Eyebrow (small text above heading)"><input value={s.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} className={inputCls} /></Field>
              <Field label="Heading (first line)"><input value={s.heroHeadingPrefix} onChange={(e) => set("heroHeadingPrefix", e.target.value)} className={inputCls} /></Field>
              <Field label="Rotating typewriter words" hint="These type/erase on a loop under the heading.">
                <ListEditor items={s.heroWords} onChange={(v) => set("heroWords", v)} placeholder="Retail Packaging" addLabel="Add word" />
              </Field>
              <Field label="Subtitle"><textarea value={s.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} className={areaCls} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary button — label"><input value={s.heroCtaPrimaryLabel} onChange={(e) => set("heroCtaPrimaryLabel", e.target.value)} className={inputCls} /></Field>
                <Field label="Primary button — link"><input value={s.heroCtaPrimaryHref} onChange={(e) => set("heroCtaPrimaryHref", e.target.value)} className={inputCls} /></Field>
                <Field label="Secondary button — label"><input value={s.heroCtaSecondaryLabel} onChange={(e) => set("heroCtaSecondaryLabel", e.target.value)} className={inputCls} /></Field>
                <Field label="Secondary button — link"><input value={s.heroCtaSecondaryHref} onChange={(e) => set("heroCtaSecondaryHref", e.target.value)} className={inputCls} /></Field>
              </div>
            </Card>
          )}

          {active === "footer" && (
            <Card icon={PanelBottom} title="Footer">
              <Field label="About / description"><textarea value={s.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} className={areaCls} /></Field>
              <Field label="Copyright" hint="Use {year} for the current year."><input value={s.footerCopyright} onChange={(e) => set("footerCopyright", e.target.value)} className={inputCls} /></Field>
              <Field label="Address"><input value={s.address} onChange={(e) => set("address", e.target.value)} className={inputCls} /></Field>
            </Card>
          )}

          {active === "contact" && (
            <Card icon={Phone} title="Contact & Social">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone"><input value={s.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} /></Field>
                <Field label="Email"><input type="email" value={s.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
              </div>
              <Field label="Instagram URL"><input value={s.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputCls} /></Field>
              <Field label="Facebook URL"><input value={s.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputCls} /></Field>
              <Field label="X (Twitter) URL"><input value={s.twitter} onChange={(e) => set("twitter", e.target.value)} className={inputCls} /></Field>
            </Card>
          )}

          {active === "seo" && (
            <Card icon={Search} title="SEO">
              <Field label="Meta title"><input value={s.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputCls} /></Field>
              <Field label="Meta description" hint={`${s.seoDescription.length} characters (aim for 150–160).`}>
                <textarea value={s.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className={areaCls} />
              </Field>
            </Card>
          )}
        </div>
      </div>

      {/* sticky save bar */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur">
          <div className="container-x flex items-center justify-between gap-3 py-3">
            <span className="text-sm font-medium text-ink-soft">
              {status === "error" ? <span className="text-red-600">Couldn&apos;t save — try again.</span> : "You have unsaved changes."}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setS(saved); setStatus("idle"); }} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface">Discard</button>
              <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* saved toast */}
      {status === "ok" && !dirty && (
        <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lg">
          <Check size={16} className="text-green" /> Saved &amp; live
        </div>
      )}
    </div>
  );
}
